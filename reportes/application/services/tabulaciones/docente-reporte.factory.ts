import { DocenteAgrupado } from "./agrupador.service.js";
import {
    DocenteReporteDto,
    PuntajePreguntaDto,
    RespuestaEscalaDto,
    ComentarioDto
} from "../../dto/reporte-cuestionario-docente-grupo.dto.js";

export class DocenteReporteFactory {

    crear(docente: DocenteAgrupado): DocenteReporteDto {

        const puntajes = this.calcularPuntajes(docente.respuestas);

        return {
            docenteId: docente.docenteId,
            docenteNombre: docente.docenteNombre,
            docenteApellido: docente.docenteApellido,
            cursoId: docente.cursoId,
            cursoNombre: docente.cursoNombre,
            seccionId: docente.seccionId,
            seccionNombre: docente.seccionNombre,
            puntajeTotal: this.calcularPromedioGeneral(puntajes),
            puntajePorPregunta: puntajes,
            respuestasEscala: this.obtenerRespuestasEscala(docente.respuestas),
            comentarios: this.obtenerComentarios(docente.respuestas),
            totalInvitaciones: docente.totalInvitaciones
        };
    }

    private calcularPuntajes(...) { ... }

    private calcularPromedioGeneral(...) { ... }

    private obtenerComentarios(...) { ... }

    private obtenerRespuestasEscala(...) { ... }

}