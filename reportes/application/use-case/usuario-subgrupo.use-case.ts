import { ListarusuarioEvaluadorPorsubGrupoUseCase } from "../../../usuario-evaluador/application/use-case/listar-usuario-evaluador-por-subgrupo.use-case.js";
import { UsuarioSubgrupoEvaluadolistarPorSubgrupoPeriodoUseCase } from "../../../usuario-subgrupo-evaluado/application/use-case/listar-por-subgrupo-periodo.use-case.js";
import { ObtenerUsuarioSubgrupoEvaluadoPorIdUseCase } from "../../../usuario-subgrupo-evaluado/application/use-case/obtener-por-id.use-case.js";
import { PdfService } from "../../../../shared/pdf/pdf.service.js";
import { ReporteUsuarioSubgrupoModel } from "../../domain/model/reporte-usuario-subgrupo.model.js";
import { NoExisteError } from "../../../../shared/error/no_existe.error.js";
import { ReporteUsuarioSubgrupoDto } from "../dto/reporte-usuario-subgrupo.dto.js";
import { UsuarioSubgrupoReportBuilder } from "../../presentation/builders/usuario-subgrupo-report.builder.js";

export class GenerarReporteUsuarioSubgrupoUseCase {
    constructor(
        private readonly UsuarioEvaluadorUseCase: ListarusuarioEvaluadorPorsubGrupoUseCase,
        private readonly UsuarioSubgrupoUseCase: UsuarioSubgrupoEvaluadolistarPorSubgrupoPeriodoUseCase,
        private readonly UsuarioId: ObtenerUsuarioSubgrupoEvaluadoPorIdUseCase,
        private readonly pdfService: PdfService,
        private readonly pdfUsuarioSubgrupo: UsuarioSubgrupoReportBuilder
    ) { }
    public async execute(model: ReporteUsuarioSubgrupoModel): Promise<Buffer> {
        const rowsUE = await this.UsuarioEvaluadorUseCase.execute({ usuario_subgrupo_evaluado_id: model.usuario_subgrupo_evaluado_id });
        const usuarioId = await this.UsuarioId.execute({ id: model.usuario_subgrupo_evaluado_id })
        const usuarioEvaluado = await this.UsuarioSubgrupoUseCase.execute({ subgrupo_evaluado_id: usuarioId.subgrupo_evaluado_id, periodo_id: usuarioId.periodo_id })
        const evaluado = usuarioEvaluado.find(
            u => u.useId === model.usuario_subgrupo_evaluado_id
        );
        if (!evaluado) {
            throw new NoExisteError(model.usuario_subgrupo_evaluado_id.toString());
        }

        const reporte: ReporteUsuarioSubgrupoDto = {
            periodo: evaluado.nombrePeriodo,
            subgrupo: evaluado.nombreSubgrupo,
            nombreUsuario: evaluado.nombreUsuario,
            apellidoUsuario: evaluado.apellidoUsuario,
            totalEvaluadores: rowsUE.total_evaluadores,
            evaluadores: rowsUE.evaluadores.map((e, index) => ({
                numero: index + 1,
                nombre: e.nombreUsuario,
                apellido: e.apellidoUsuario
            }))
        };

        const definition = this.pdfUsuarioSubgrupo.build(reporte);
        return await this.pdfService.generar(definition);
    }
}