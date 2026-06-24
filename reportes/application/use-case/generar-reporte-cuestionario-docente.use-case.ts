// application/use-case/generar-reporte-cuestionario-docente.use-case.ts
import { PdfService } from "../../../../shared/pdf/pdf.service.js";
import { NoExisteError } from "../../../../shared/error/no_existe.error.js";
import { ReporteCuestionarioRepository } from "../../domain/reporte-cuestionario-repository.interface.js";
import { ReporteCuestionarioModel } from "../../domain/model/reporte-cuestionario-docente.model.js";
import { ReporteCuestionarioDocenteDto } from "../dto/reporte-cuestionario-docente.dto.js";
import { CuestionarioDocenteReportBuilder } from "../../presentation/builders/cuestionario-docente-report.builder.js";
import { ReporteCuestionarioService } from "../services/tabulaciones/reporte-cuestionario.service.js";

export class GenerarReporteCuestionarioDocenteUseCase {
    constructor(
        private readonly repository: ReporteCuestionarioRepository,
        private readonly pdfService: PdfService,
        private readonly pdfBuilder: CuestionarioDocenteReportBuilder,
        private readonly reporteService: ReporteCuestionarioService // ← ¡ESTE DEBE EXISTIR!
    ) {
        console.log('🔍 Constructor Use Case:');
        console.log('  - repository:', !!this.repository);
        console.log('  - pdfService:', !!this.pdfService);
        console.log('  - pdfBuilder:', !!this.pdfBuilder);
        console.log('  - reporteService:', !!this.reporteService);
    }

    async execute(model: ReporteCuestionarioModel): Promise<Buffer> {
        console.log('🚀 Ejecutando use case...');
        
        // ✅ Verificar antes de usar
        if (!this.reporteService) {
            throw new Error('❌ reporteService es undefined en execute()');
        }
        
        const respuestas = await this.repository.listarRespuestasPorCuestionarioDocente(model.cuestionario_id);
        
        if (!respuestas || respuestas.length === 0) {
            throw new NoExisteError('No hay respuestas para este cuestionario');
        }

        const base = respuestas[0];
        const tabulacion = this.reporteService.generar(respuestas);

        const dto: ReporteCuestionarioDocenteDto = {
            cuestionarioId: base.cuestionarioId,
            cuestionarioNombre: base.cuestionarioNombre,
            anio: base.anio,
            unidad: base.unidad,
            periodoId: base.periodoId,
            periodoNombre: base.periodoNombre,
            evaluacion_id: base.evaluacion_id,
            docenteId: base.docenteId,
            docenteNombre: base.docenteNombre,
            docenteApellido: base.docenteApellido,
            cursoId: base.cursoId,
            cursoNombre: base.cursoNombre,
            seccionId: base.seccionId,
            seccionNombre: base.seccionNombre,
            destinoTipo: base.destinoTipo,
            destinoId: base.destinoId,
            destinoNombre: base.destinoNombre,
            totalInvitaciones: base.totalInvitaciones,
            escala: tabulacion.escala,
            opcion: tabulacion.opcion,
            abiertas: tabulacion.abiertas,
        };

        const definition = this.pdfBuilder.build(dto);
        return await this.pdfService.generar(definition);
    }
}