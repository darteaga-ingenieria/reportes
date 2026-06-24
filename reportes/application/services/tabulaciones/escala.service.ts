import { ReporteCuestionarioDetalleModel } from "../../../domain/model/reporte-cuestionario-docente-detalle.model.js";
import { TabulacionPreguntaDto, TabulacionOpcionesDto } from "../../dto/reporte-cuestionario-docente.dto.js";

export class EscalaService {
    generar(respuestas: ReporteCuestionarioDetalleModel[]): TabulacionPreguntaDto[] {
        const preguntas = new Map<number, TabulacionPreguntaDto>();

        for (const respuesta of respuestas) {
            // Solo preguntas tipo Escala (ID = 1)
            if (respuesta.tipoPreguntaId !== 1) continue;
            if (respuesta.respuestaOpcionValor == null) continue;

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
            pregunta.promedio += respuesta.respuestaOpcionValor;

            let opcion = pregunta.opciones.find(
                x => x.respuestaOpcionValor === respuesta.respuestaOpcionValor
            );
            if (!opcion) {
                opcion = {
                    respuestaOpcionId: respuesta.respuestaOpcionId || undefined,
                    respuestaOpcionDescripcion: this.getDescripcion(respuesta.respuestaOpcionValor),
                    respuestaOpcionValor: respuesta.respuestaOpcionValor,
                    cantidad: 0,
                };
                pregunta.opciones.push(opcion);
            }
            opcion.cantidad++;
        }

        // Calcular promedios
        for (const pregunta of preguntas.values()) {
            if (pregunta.total > 0) {
                pregunta.promedio = Number((pregunta.promedio / pregunta.total).toFixed(2));
            }
            pregunta.opciones.sort((a, b) => a.respuestaOpcionValor - b.respuestaOpcionValor);
        }

        return [...preguntas.values()].sort((a, b) => a.orden - b.orden);
    }

    private getDescripcion(valor: number): string {
        const map: Record<number, string> = {
            1: 'Muy en desacuerdo',
            2: 'En desacuerdo',
            3: 'Neutral',
            4: 'De acuerdo',
            5: 'Muy de acuerdo'
        };
        return map[valor] || `Opción ${valor}`;
    }
}