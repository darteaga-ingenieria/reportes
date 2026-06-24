import { DocenteReporteDto, RankingItemDto } from "../../dto/reporte-cuestionario-docente-grupo.dto.js";

export class RankingService {
    generarRanking(docentes: DocenteReporteDto[]): RankingItemDto[] {
        if (!docentes || docentes.length === 0) {
            return [];
        }

        // Ya vienen ordenados del agrupador, pero lo re-ordenamos por seguridad
        const sorted = [...docentes].sort((a, b) => b.puntajeTotal - a.puntajeTotal);
        
        return sorted.map((docente, index) => ({
            posicion: index + 1,
            docenteId: docente.docenteId,
            nombre: `${docente.docenteNombre} ${docente.docenteApellido}`.trim(),
            curso: docente.cursoNombre || 'Sin curso',
            seccion: docente.seccionNombre || 'Sin sección',
            puntaje: docente.puntajeTotal
        }));
    }
}