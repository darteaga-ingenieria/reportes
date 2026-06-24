import { ReporteCuestionarioDetalleModel } from "./model/reporte-cuestionario-docente-detalle.model.js";

export interface ReporteCuestionarioRepository {
  listarRespuestasPorCuestionarioDocente( cuestionarioId: number ): Promise<ReporteCuestionarioDetalleModel[]>;
 }