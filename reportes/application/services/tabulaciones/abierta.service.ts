import { ReporteCuestionarioDetalleModel } from "../../../domain/model/reporte-cuestionario-docente-detalle.model.js";
import { PreguntaTextoDto, ComentarioDto } from "../../dto/reporte-cuestionario-docente.dto.js";

export class TextoService {
    generar(respuestas: ReporteCuestionarioDetalleModel[]): PreguntaTextoDto[] {
        const preguntas = new Map<number, PreguntaTextoDto>();

        for (const respuesta of respuestas) {
            // Solo preguntas abiertas (ID = 2)
            if (respuesta.tipoPreguntaId !== 2) continue;

            let pregunta = preguntas.get(respuesta.preguntaId);
            if (!pregunta) {
                pregunta = {
                    preguntaId: respuesta.preguntaId,
                    orden: respuesta.ordenPlantilla,
                    preguntaTexto: respuesta.preguntaTexto,
                    total: 0,
                    comentarios: [],
                };
                preguntas.set(respuesta.preguntaId, pregunta);
            }

            pregunta.total++;

            if (respuesta.respuestaTexto && respuesta.respuestaTexto.trim() !== '') {
                pregunta.comentarios.push({
                    invitacionId: respuesta.invitacionId,
                    respuestaId: respuesta.respuestaId,
                    comentario: respuesta.respuestaTexto.trim(),
                });
            }
        }

        return [...preguntas.values()].sort((a, b) => a.orden - b.orden);
    }
}