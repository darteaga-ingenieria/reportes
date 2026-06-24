import { EventPublisher } from "../../../shared/events/event-publisher.interface.js";
import { usuarioEvaluadorRepository } from "../../usuario-evaluador/domain/usuario-evaluador.repository.interface.js";
import { UsuarioSubgrupoEvaluadoRepository } from "../../usuario-subgrupo-evaluado/domain/usuario-subgrupo-evaluado.repository.interface.js";
import { UsuarioTipoColaboradorRepository } from "../../usuario-tipo-colaborador/domain/usuario-tipo-colaborador.repository.interface.js";
import { ReporteCuestionarioRepository } from "../domain/reporte-cuestionario-repository.interface.js";
import { PdfService } from "../../../shared/pdf/pdf.service.js";
import { ReporteCuestionarioService } from "../application/services/tabulaciones/reporte-cuestionario.service.js";
import { CuestionarioDocenteReportBuilder } from "../presentation/builders/cuestionario-docente-report.builder.js";
import { GenerarReporteCuestionarioDocenteUseCase } from "../application/use-case/generar-reporte-cuestionario-docente.use-case.js";
// ✅ IMPORTAR NUEVAS DEPENDENCIAS
import { AgrupadorService } from "../application/services/tabulaciones/agrupador.service.js";
import { RankingService } from "../application/services/tabulaciones/ranking.service.js";
import { GrupoCuestionarioReportBuilder } from "../presentation/builders/grupo-cuestionario-report.builder.js";
import { GenerarReporteCuestionarioGrupoUseCase } from "../application/use-case/generar-reporte-cuestionario-grupo-docente.use-case.js";
export interface ReporteDependencies {
    // Dependencias existentes
    usuarioTipoColaboradorRepository: UsuarioTipoColaboradorRepository;
    cuestionarioDocenteRepository: ReporteCuestionarioRepository;
    usuarioEvaluadorRepository: usuarioEvaluadorRepository;
    usuarioSubgrupoRepository: UsuarioSubgrupoEvaluadoRepository;
    eventPublisher: EventPublisher;
    pdfService: PdfService;
    reporteCuestionarioService: ReporteCuestionarioService;
    cuestionarioDocenteReportBuilder: CuestionarioDocenteReportBuilder;
    generarReporteCuestionarioDocenteUseCase: GenerarReporteCuestionarioDocenteUseCase;
    
    // ✅ NUEVAS DEPENDENCIAS
    agrupadorService: AgrupadorService;
    rankingService: RankingService;
    grupoCuestionarioReportBuilder: GrupoCuestionarioReportBuilder;
    generarReporteCuestionarioGrupoUseCase: GenerarReporteCuestionarioGrupoUseCase;
}