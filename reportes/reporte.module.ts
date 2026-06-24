// reporte.module.ts
import { Router } from "express";
import { ReporteDependencies } from "./dependencies/reporte.dependencies.js";
import { ReporteController } from "./presentation/controller/reporte.controller.js";
import { createReporteRouter } from "./presentation/router/reporte.router.js";
import { GenerarReporteColaboradorUseCase } from "./application/use-case/generar-reporte-colaborador.use-case.js";
import { PdfService } from "../../shared/pdf/pdf.service.js";
import { ColaboradorReportBuilder } from "./presentation/builders/colaborador-report.builder.js";
import { GenerarReporteUsuarioSubgrupoUseCase } from "./application/use-case/usuario-subgrupo.use-case.js";
import { ListarusuarioEvaluadorPorsubGrupoUseCase } from "../usuario-evaluador/application/use-case/listar-usuario-evaluador-por-subgrupo.use-case.js";
import { UsuarioSubgrupoEvaluadolistarPorSubgrupoPeriodoUseCase } from "../usuario-subgrupo-evaluado/application/use-case/listar-por-subgrupo-periodo.use-case.js";
import { ObtenerUsuarioSubgrupoEvaluadoPorIdUseCase } from "../usuario-subgrupo-evaluado/application/use-case/obtener-por-id.use-case.js";
import { UsuarioSubgrupoReportBuilder } from "./presentation/builders/usuario-subgrupo-report.builder.js";
import { GenerarReporteCuestionarioDocenteUseCase } from "./application/use-case/generar-reporte-cuestionario-docente.use-case.js";
import { CuestionarioDocenteReportBuilder } from "./presentation/builders/cuestionario-docente-report.builder.js";
import { ReporteCuestionarioService } from "./application/services/tabulaciones/reporte-cuestionario.service.js";

// ✅ NUEVAS IMPORTACIONES PARA EL REPORTE DE GRUPO
import { AgrupadorService } from "./application/services/tabulaciones/agrupador.service.js";
import { RankingService } from "./application/services/tabulaciones/ranking.service.js";
import { GrupoCuestionarioReportBuilder } from "./presentation/builders/grupo-cuestionario-report.builder.js";
import { GenerarReporteCuestionarioGrupoUseCase } from "./application/use-case/generar-reporte-cuestionario-grupo-docente.use-case.js";
export const buildReporteModule = (deps: ReporteDependencies): Router => {
    const router = Router();
    
    // ========== DEPENDENCIAS EXISTENTES (NO TOCAR) ==========
    const repository = deps.usuarioTipoColaboradorRepository;
    const repositoryUsuarioEvaluador = new ListarusuarioEvaluadorPorsubGrupoUseCase(deps.usuarioEvaluadorRepository);
    const repositoryUsuarioSubgrupo = new UsuarioSubgrupoEvaluadolistarPorSubgrupoPeriodoUseCase(deps.usuarioSubgrupoRepository);
    const repositoryUsuariod = new ObtenerUsuarioSubgrupoEvaluadoPorIdUseCase(deps.usuarioSubgrupoRepository);
    const repositoryCuestionarioDocente = deps.cuestionarioDocenteRepository;
    const pdfService = new PdfService();
    const builder = new ColaboradorReportBuilder();
    const builderUsuarioSubgrupo = new UsuarioSubgrupoReportBuilder();
    const builderCuestionarioDocente = new CuestionarioDocenteReportBuilder();
    
    // ========== SERVICIOS EXISTENTES ==========
    const reporteCuestionarioService = new ReporteCuestionarioService();
    
    // ========== USE CASE INDIVIDUAL (EXISTENTE) ==========
    const generarReporteCuestionarioDocenteUseCase = new GenerarReporteCuestionarioDocenteUseCase(
        repositoryCuestionarioDocente,
        pdfService,
        builderCuestionarioDocente,
        reporteCuestionarioService
    );

    // ========== ✅ NUEVOS SERVICIOS PARA REPORTE DE GRUPO ==========
    const agrupadorService = new AgrupadorService();
    const rankingService = new RankingService();
    const grupoCuestionarioReportBuilder = new GrupoCuestionarioReportBuilder();

    // ========== ✅ NUEVO USE CASE DE GRUPO ==========
    const generarReporteCuestionarioGrupoUseCase = new GenerarReporteCuestionarioGrupoUseCase(
        repositoryCuestionarioDocente,      // 1. Repository (el mismo)
        pdfService,                         // 2. PdfService (el mismo)
        grupoCuestionarioReportBuilder,     // 3. Builder de grupo (NUEVO)
        agrupadorService,                   // 4. AgrupadorService (NUEVO)
        rankingService                      // 5. RankingService (NUEVO)
    );

    // ========== CONTROLLER CON TODOS LOS USE CASES ==========
    const controller = new ReporteController(
        new GenerarReporteColaboradorUseCase(repository, pdfService, builder),
        new GenerarReporteUsuarioSubgrupoUseCase(
            repositoryUsuarioEvaluador,
            repositoryUsuarioSubgrupo,
            repositoryUsuariod,
            pdfService,
            builderUsuarioSubgrupo
        ),
        generarReporteCuestionarioDocenteUseCase,  // Individual (EXISTENTE)
        generarReporteCuestionarioGrupoUseCase     // ✅ Grupo (NUEVO)
    );
    
    router.use('/', createReporteRouter(controller));
    return router;
}