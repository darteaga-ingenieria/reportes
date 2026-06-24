
import { getConnection } from "../../../../infrastructure/sqlserver/connection.js";
    import { mapSqlError } from "../../../../infrastructure/sqlserver/sql-error.helper.js";
import { ReporteCuestionarioDetalleModel } from "../../domain/model/reporte-cuestionario-docente-detalle.model.js";
import { ReporteCuestionarioModel } from "../../domain/model/reporte-cuestionario-docente.model.js";
import { ReporteCuestionarioRepository } from "../../domain/reporte-cuestionario-repository.interface.js";  

export class SqlServerReporteCuestionarioRepository implements ReporteCuestionarioRepository{
      public async listarRespuestasPorCuestionarioDocente(cuestionario_id: number): Promise<ReporteCuestionarioDetalleModel[]> {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('cuestionario_id', cuestionario_id)
                .execute('usp_listar_respuestas_por_cuestionario_docente');
            return result.recordset;
        } catch (error) {
            throw mapSqlError(error)
        }
    }
}
  