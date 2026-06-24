import { ReporteCuestionarioDetalleModel } from "../../../domain/model/reporte-cuestionario-docente-detalle.model.js";
import { 
    DocenteReporteDto, 
    PuntajePreguntaDto, 
    RespuestaEscalaDto, 
    ComentarioDto 
} from "../../dto/reporte-cuestionario-docente-grupo.dto.js";

export class AgrupadorService {
    
    agruparPorDocente(respuestas: ReporteCuestionarioDetalleModel[]): DocenteReporteDto[] {
        // Validar que hay respuestas
        if (!respuestas || respuestas.length === 0) {
            return [];
        }

        const docentesMap = new Map<number, {
            docenteId: number;
            docenteNombre: string;
            docenteApellido: string;
            cursoId: number;
            cursoNombre: string;
            seccionId: number;
            seccionNombre: string;
            respuestas: ReporteCuestionarioDetalleModel[];
            totalInvitaciones: number;
        }>();

        // 1. Agrupar por docenteId
        for (const respuesta of respuestas) {
            // Validar que el docenteId existe
            if (!respuesta.docenteId) {
                console.warn('⚠️ Respuesta sin docenteId:', respuesta);
                continue;
            }

            const key = respuesta.docenteId;
            if (!docentesMap.has(key)) {
                docentesMap.set(key, {
                    docenteId: respuesta.docenteId,
                    docenteNombre: respuesta.docenteNombre || 'Sin nombre',
                    docenteApellido: respuesta.docenteApellido || '',
                    cursoId: respuesta.cursoId || 0,
                    cursoNombre: respuesta.cursoNombre || 'Sin curso',
                    seccionId: respuesta.seccionId || 0,
                    seccionNombre: respuesta.seccionNombre || 'Sin sección',
                    respuestas: [],
                    totalInvitaciones: respuesta.totalInvitaciones || 0
                });
            }
            docentesMap.get(key)!.respuestas.push(respuesta);
        }

        // 2. Calcular puntajes para cada docente
        const docentes: DocenteReporteDto[] = [];
        
        for (const [_, docente] of docentesMap) {
            const respuestas = docente.respuestas;
            
            // Calcular puntaje por pregunta (solo escala)
            const puntajePorPregunta = this.calcularPuntajePorPregunta(respuestas);
            
            // Calcular puntaje total
            const puntajeTotal = this.calcularPuntajeTotal(puntajePorPregunta);
            
            // Obtener respuestas de escala
            const respuestasEscala = this.obtenerRespuestasEscala(respuestas);
            
            // Obtener comentarios
            const comentarios = this.obtenerComentarios(respuestas);

            docentes.push({
                docenteId: docente.docenteId,
                docenteNombre: docente.docenteNombre,
                docenteApellido: docente.docenteApellido,
                cursoId: docente.cursoId,
                cursoNombre: docente.cursoNombre,
                seccionId: docente.seccionId,
                seccionNombre: docente.seccionNombre,
                puntajeTotal: puntajeTotal,
                puntajePorPregunta: puntajePorPregunta,
                respuestasEscala: respuestasEscala,
                comentarios: comentarios,
                totalInvitaciones: docente.totalInvitaciones
            });
        }

        // Ordenar por puntaje total (mayor a menor)
        return docentes.sort((a, b) => b.puntajeTotal - a.puntajeTotal);
    }

    private calcularPuntajePorPregunta(respuestas: ReporteCuestionarioDetalleModel[]): PuntajePreguntaDto[] {
        const preguntaMap = new Map<number, { 
            total: number; 
            count: number; 
            texto: string; 
            orden: number 
        }>();
        
        for (const r of respuestas) {
            // Solo preguntas de escala con valor
            if (r.tipoPreguntaId !== 1 || r.respuestaOpcionValor == null) continue;
            
            if (!preguntaMap.has(r.preguntaId)) {
                preguntaMap.set(r.preguntaId, {
                    total: 0,
                    count: 0,
                    texto: r.preguntaTexto || 'Pregunta sin texto',
                    orden: r.ordenPlantilla || 0
                });
            }
            
            const data = preguntaMap.get(r.preguntaId)!;
            data.total += r.respuestaOpcionValor;
            data.count++;
        }

        return Array.from(preguntaMap.entries()).map(([preguntaId, data]) => ({
            preguntaId,
            preguntaTexto: data.texto,
            orden: data.orden,
            promedio: data.count > 0 ? Number((data.total / data.count).toFixed(2)) : 0,
            total: data.count
        })).sort((a, b) => a.orden - b.orden);
    }

    private calcularPuntajeTotal(puntajes: PuntajePreguntaDto[]): number {
        if (puntajes.length === 0) return 0;
        const total = puntajes.reduce((sum, p) => sum + p.promedio, 0);
        return Number((total / puntajes.length).toFixed(2));
    }

    private obtenerRespuestasEscala(respuestas: ReporteCuestionarioDetalleModel[]): RespuestaEscalaDto[] {
        return respuestas
            .filter(r => r.tipoPreguntaId === 1 && r.respuestaOpcionValor != null)
            .map(r => ({
                invitacionId: r.invitacionId || 0,
                preguntaId: r.preguntaId || 0,
                preguntaTexto: r.preguntaTexto || 'Sin texto',
                valor: r.respuestaOpcionValor!,
                descripcion: this.getDescripcionValor(r.respuestaOpcionValor!)
            }));
    }

    private obtenerComentarios(respuestas: ReporteCuestionarioDetalleModel[]): ComentarioDto[] {
        return respuestas
            .filter(r => r.tipoPreguntaId === 2 && r.respuestaTexto && r.respuestaTexto.trim() !== '')
            .map(r => ({
                invitacionId: r.invitacionId || 0,
                comentario: r.respuestaTexto!
            }));
    }

    private getDescripcionValor(valor: number): string {
        const map: Record<number, string> = {
            1: 'Muy malo',
            2: 'Malo',
            3: 'Regular',
            4: 'Bueno',
            5: 'Muy bueno'
        };
        return map[valor] || `Valor ${valor}`;
    }
}