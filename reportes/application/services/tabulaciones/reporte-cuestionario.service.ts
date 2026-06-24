import { ReporteCuestionarioDetalleModel } from "../../../domain/model/reporte-cuestionario-docente-detalle.model.js";
import { TextoService } from "./abierta.service.js";
import { EscalaService } from "./escala.service.js";
import { OpcionService } from "./opcion.service.js";

export class ReporteCuestionarioService {
    constructor(
        private readonly escalaService = new EscalaService(),
        private readonly opcionService = new OpcionService(),
        private readonly textoService = new TextoService(),
    ) {}

    generar(respuestas: ReporteCuestionarioDetalleModel[]) {
        return {
            escala: this.escalaService.generar(respuestas),
            opcion: this.opcionService.generar(respuestas),
            abiertas: this.textoService.generar(respuestas),
        };
    }
}