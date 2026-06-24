import { Kafka } from "kafkajs";
import { getEnv } from "../../../shared/config/env.config.js";
import { KafkaEventPublisher } from "../../../infrastructure/kafka/kafka-event.publisher.js";
import { SqlServerusuarioTipoColaboradorRepository } from "../../usuario-tipo-colaborador/infrastructure/sqlserver/sqlserver-usuario-tipo-colaborador.repository.js";
import { ReporteDependencies } from "./reporte.dependencies.js";
import { sqlserverusuarioEvaluadorRepository } from "../../usuario-evaluador/infrastructure/sqlserver/sqlserver-usuario-evaluador.repository.js";
import { SqlServerUsuarioSubgrupoEvaluadoRepository } from "../../usuario-subgrupo-evaluado/infrastructure/sqlserver/sqlserver-usuario-subgrupo-evaluado.respository.js";
import { SqlServerReporteCuestionarioRepository } from "../infrastructure/repository/sqlserver-reporte-cuestionario.repository.js";
import { PdfService } from "../../../shared/pdf/pdf.service.js";
import { ReporteCuestionarioService } from "../application/services/tabulaciones/reporte-cuestionario.service.js";
import { CuestionarioDocenteReportBuilder } from "../presentation/builders/cuestionario-docente-report.builder.js";
import { GenerarReporteCuestionarioDocenteUseCase } from "../application/use-case/generar-reporte-cuestionario-docente.use-case.js";
// ✅ IMPORTAR NUEVAS DEPENDENCIAS
import { AgrupadorService } from "../application/services/tabulaciones/agrupador.service.js";
import { RankingService } from "../application/services/tabulaciones/ranking.service.js";
import { GrupoCuestionarioReportBuilder } from "../presentation/builders/grupo-cuestionario-report.builder.js";
import { GenerarReporteCuestionarioGrupoUseCase } from "../application/use-case/generar-reporte-cuestionario-grupo-docente.use-case.js";
let instance: ReporteDependencies | null = null;

export function buildReporteDependencies(): ReporteDependencies {
    if (instance) {
        console.log('♻️ Usando instancia existente de dependencias');
        return instance;
    }

    console.log('🏗️ Construyendo dependencias...');

    const env = getEnv();
    const kafka = new Kafka({
        clientId: 'encuesta-api',
        brokers: env.KAFKA_BROKER.split(',')
    });

    // ✅ Crear dependencias existentes
    const pdfService = new PdfService();
    const cuestionarioDocenteRepository = new SqlServerReporteCuestionarioRepository();
    const reporteCuestionarioService = new ReporteCuestionarioService();
    const cuestionarioDocenteReportBuilder = new CuestionarioDocenteReportBuilder();

    // ✅ Crear NUEVAS dependencias para el reporte de grupo
    const agrupadorService = new AgrupadorService();
    const rankingService = new RankingService();
    const grupoCuestionarioReportBuilder = new GrupoCuestionarioReportBuilder();

    // ✅ Crear Use Cases
    const generarReporteCuestionarioDocenteUseCase = new GenerarReporteCuestionarioDocenteUseCase(
        cuestionarioDocenteRepository,
        pdfService,
        cuestionarioDocenteReportBuilder,
        reporteCuestionarioService
    );

    const generarReporteCuestionarioGrupoUseCase = new GenerarReporteCuestionarioGrupoUseCase(
        cuestionarioDocenteRepository,
        pdfService,
        grupoCuestionarioReportBuilder,
        agrupadorService,
        rankingService
    );

    console.log('✅ Use Cases creados correctamente');

    instance = {
        usuarioTipoColaboradorRepository: new SqlServerusuarioTipoColaboradorRepository(),
        usuarioEvaluadorRepository: new sqlserverusuarioEvaluadorRepository(),
        usuarioSubgrupoRepository: new SqlServerUsuarioSubgrupoEvaluadoRepository(),
        cuestionarioDocenteRepository: cuestionarioDocenteRepository,
        eventPublisher: new KafkaEventPublisher(kafka),
        pdfService: pdfService,
        reporteCuestionarioService: reporteCuestionarioService,
        cuestionarioDocenteReportBuilder: cuestionarioDocenteReportBuilder,
        generarReporteCuestionarioDocenteUseCase: generarReporteCuestionarioDocenteUseCase,
        // ✅ NUEVAS dependencias
        agrupadorService: agrupadorService,
        rankingService: rankingService,
        grupoCuestionarioReportBuilder: grupoCuestionarioReportBuilder,
        generarReporteCuestionarioGrupoUseCase: generarReporteCuestionarioGrupoUseCase
    };

    return instance;
}

export const generarReporteCuestionarioDocenteUseCase = buildReporteDependencies().generarReporteCuestionarioDocenteUseCase;
export const generarReporteCuestionarioGrupoUseCase = buildReporteDependencies().generarReporteCuestionarioGrupoUseCase;