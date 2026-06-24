import { ReporteCuestionarioDetalleModel } from "../../../domain/model/reporte-cuestionario-docente-detalle.model.js";
import { TabulacionPreguntaDto } from "../../dto/reporte-cuestionario-docente.dto.js";

export class OpcionService {
    generar(respuestas: ReporteCuestionarioDetalleModel[]): TabulacionPreguntaDto[] {
        const preguntas = new Map<number, TabulacionPreguntaDto>();

        for (const respuesta of respuestas) {
            // Solo preguntas tipo Opción (ID = 3 o 4)
            if (respuesta.tipoPreguntaId !== 3 && respuesta.tipoPreguntaId !== 4) continue;
            if (respuesta.respuestaOpcionId == null) continue;

            let pregunta = preguntas.get(respuesta.preguntaId);
            if (!pregunta) {
                pregunta = {
                    preguntaId: respuesta.preguntaId,
                    orden: respuesta.ordenPlantilla,
                    preguntaTexto: respuesta.preguntaTexto,
                    promedio: 0,
                    total: 0,
                    opciones: [],
                };
                preguntas.set(respuesta.preguntaId, pregunta);
            }

            pregunta.total++;

            let opcion = pregunta.opciones.find(
                x => x.respuestaOpcionId === respuesta.respuestaOpcionId
            );
            if (!opcion) {
                opcion = {
                    respuestaOpcionId: respuesta.respuestaOpcionId,
                    respuestaOpcionDescripcion: respuesta.respuestaOpcionDescripcion || 'Sin descripción',
                    respuestaOpcionValor: 0,
                    cantidad: 0,
                };
                pregunta.opciones.push(opcion);
            }
            opcion.cantidad++;
        }

        return [...preguntas.values()].sort((a, b) => a.orden - b.orden);
    }
}