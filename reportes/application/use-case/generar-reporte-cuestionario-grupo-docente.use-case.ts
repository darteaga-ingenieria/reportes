import { PdfService } from "../../../../shared/pdf/pdf.service.js";
import { NoExisteError } from "../../../../shared/error/no_existe.error.js";
import { ReporteCuestionarioRepository } from "../../domain/reporte-cuestionario-repository.interface.js";
import { ReporteCuestionarioModel } from "../../domain/model/reporte-cuestionario-docente.model.js";
import { ReporteCuestionarioGrupoDto, PreguntaInstrumentoDto } from "../dto/reporte-cuestionario-docente-grupo.dto.js";
import { GrupoCuestionarioReportBuilder } from "../../presentation/builders/grupo-cuestionario-report.builder.js";
import { AgrupadorService } from "../services/tabulaciones/agrupador.service.js";
import { RankingService } from "../services/tabulaciones/ranking.service.js";

export class GenerarReporteCuestionarioGrupoUseCase {
    constructor(
        private readonly repository: ReporteCuestionarioRepository,
        private readonly pdfService: PdfService,
        private readonly pdfBuilder: GrupoCuestionarioReportBuilder,
        private readonly agrupadorService: AgrupadorService,
        private readonly rankingService: RankingService
    ) {
        // Log para verificar que se inyectan correctamente
        console.log('✅ GenerarReporteCuestionarioGrupoUseCase inicializado');
        console.log('  - repository:', !!this.repository);
        console.log('  - pdfService:', !!this.pdfService);
        console.log('  - pdfBuilder:', !!this.pdfBuilder);
        console.log('  - agrupadorService:', !!this.agrupadorService);
        console.log('  - rankingService:', !!this.rankingService);
    }

    async execute(model: ReporteCuestionarioModel): Promise<Buffer> {
        console.log('🚀 Generando reporte de grupo...');
        console.log(`📋 Cuestionario ID: ${model.cuestionario_id}`);
        
        try {
            // 1. Obtener todas las respuestas
            const respuestas = await this.repository.listarRespuestasPorCuestionarioDocente(
                model.cuestionario_id
            );
            
            if (!respuestas || respuestas.length === 0) {
                throw new NoExisteError('No hay respuestas para este cuestionario');
            }

            console.log(`📊 Total respuestas: ${respuestas.length}`);

            // 2. Datos generales del cuestionario
            const base = respuestas[0];
            
            // 3. Agrupar por docente
            const docentes = this.agrupadorService.agruparPorDocente(respuestas);
            console.log(`👥 ${docentes.length} docentes encontrados`);

            // 4. Generar ranking
            const ranking = this.rankingService.generarRanking(docentes);
            console.log(`🏆 Ranking generado con ${ranking.length} posiciones`);

            // 5. Extraer preguntas del instrumento
            const preguntas = this.extraerPreguntas(respuestas);
            console.log(`📝 ${preguntas.length} preguntas encontradas`);

            // 6. Construir DTO
            const dto: ReporteCuestionarioGrupoDto = {
                cuestionarioId: base.cuestionarioId,
                cuestionarioNombre: base.cuestionarioNombre || 'Cuestionario sin nombre',
                anio: base.anio || 0,
                unidad: base.unidad || 'Sin unidad',
                periodoId: base.periodoId || 0,
                periodoNombre: base.periodoNombre || 'Sin periodo',
                evaluacion_id: base.evaluacion_id || 0,
                docentes: docentes,
                ranking: ranking,
                preguntas: preguntas,
                totalDocentes: docentes.length,
                totalInvitaciones: base.totalInvitaciones || 0
            };

            // 7. Generar PDF
            console.log('📄 Generando PDF...');
            const definition = this.pdfBuilder.build(dto);
            const pdfBuffer = await this.pdfService.generar(definition);
            console.log(`✅ PDF generado exitosamente (${pdfBuffer.length} bytes)`);
            
            return pdfBuffer;

        } catch (error) {
            console.error('❌ Error en GenerarReporteCuestionarioGrupoUseCase:', error);
            throw error;
        }
    }

    private extraerPreguntas(respuestas: any[]): PreguntaInstrumentoDto[] {
        const preguntasMap = new Map<number, PreguntaInstrumentoDto>();
        
        for (const r of respuestas) {
            if (!preguntasMap.has(r.preguntaId)) {
                preguntasMap.set(r.preguntaId, {
                    preguntaId: r.preguntaId || 0,
                    orden: r.ordenPlantilla || 0,
                    preguntaTexto: r.preguntaTexto || 'Pregunta sin texto',
                    tipoPreguntaId: r.tipoPreguntaId || 0,
                    tipoPreguntaNombre: r.tipoPreguntaNombre || 'Sin tipo'
                });
            }
        }
        
        return Array.from(preguntasMap.values())
            .sort((a, b) => a.orden - b.orden);
    }
}