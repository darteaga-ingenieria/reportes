import { Request, Response, NextFunction } from "express";
import { GenerarReporteColaboradorUseCase }
  from "../../application/use-case/generar-reporte-colaborador.use-case.js";
import { GenerarReporteUsuarioSubgrupoUseCase } from "../../application/use-case/usuario-subgrupo.use-case.js";
import { ObtenerRespuestaDocenteCuestionarioSchema, ObtenerUsuarioSubgrupoSchema } from "../validation/usuario-subgrupo.schema.js";
import { GenerarReporteCuestionarioDocenteUseCase } from "../../application/use-case/generar-reporte-cuestionario-docente.use-case.js";
import { GenerarReporteCuestionarioGrupoUseCase } from "../../application/use-case/generar-reporte-cuestionario-grupo-docente.use-case.js";
export class ReporteController {
  constructor(
    private readonly generarReporteColaboradorUseCase:
      GenerarReporteColaboradorUseCase,
    private readonly generarReporteUsuarioSubgrupoUseCase: GenerarReporteUsuarioSubgrupoUseCase,
    private readonly generarReporteCuestionarioDocenteUseCase: GenerarReporteCuestionarioDocenteUseCase,
    private readonly generarReporteCuestionarioGrupoUseCase: GenerarReporteCuestionarioGrupoUseCase
  ) { }

  public previewColaboradores = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const pdf =
        await this.generarReporteColaboradorUseCase.execute();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      return res.send(pdf);
    } catch (error) {
      next(error);
    }
  }

  public downloadColaboradores = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const pdf =
        await this.generarReporteColaboradorUseCase.execute();
      res.setHeader(
        'Content-Type',
        'application/pdf'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=colaboradores.pdf'
      );
      return res.send(pdf);
    } catch (error) {
      next(error);
    }
  }

  public previewEvaluadores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = ObtenerUsuarioSubgrupoSchema.parse({
        usuario_subgrupo_evaluado_id: Number(req.params.usuario_subgrupo_evaluado_id),
      });
      const pdf = await this.generarReporteUsuarioSubgrupoUseCase.execute(data);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      return res.send(pdf);
    } catch (error) {
      next(error);
    }
  };

  public downloadEvaluadores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = ObtenerUsuarioSubgrupoSchema.parse({
        usuario_subgrupo_evaluado_id: Number(req.params.usuario_subgrupo_evaluado_id),
      });
      const pdf = await this.generarReporteUsuarioSubgrupoUseCase.execute(data);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=evaluadores.pdf");
      return res.send(pdf);
    } catch (error) {
      next(error);
    }
  };


     public previewCuestionarioDocentes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('👀 Preview individual - cuestionario:', req.params.cuestionario_id);
            
            const data = ObtenerRespuestaDocenteCuestionarioSchema.parse({
                cuestionario_id: Number(req.params.cuestionario_id),
            });
            
            const pdf = await this.generarReporteCuestionarioDocenteUseCase.execute(data);
            
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename=reporte-cuestionario.pdf");
            return res.send(pdf);
        } catch (error) {
            console.error('❌ Error en previewCuestionarioDocentes:', error);
            next(error);
        }
    };

    public downloadCuestionarioDocentes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('⬇️ Download individual - cuestionario:', req.params.cuestionario_id);
            
            const data = ObtenerRespuestaDocenteCuestionarioSchema.parse({
                cuestionario_id: Number(req.params.cuestionario_id),
            });
            
            const pdf = await this.generarReporteCuestionarioDocenteUseCase.execute(data);
            
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=reporte-cuestionario-${data.cuestionario_id}.pdf`);
            return res.send(pdf);
        } catch (error) {
            console.error('❌ Error en downloadCuestionarioDocentes:', error);
            next(error);
        }
    };

    // ==================== REPORTE DE GRUPO ====================

    public previewCuestionarioGrupo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('👀 Preview grupo - cuestionario:', req.params.cuestionario_id);
            
            const data = ObtenerRespuestaDocenteCuestionarioSchema.parse({
                cuestionario_id: Number(req.params.cuestionario_id),
            });
            
            const pdf = await this.generarReporteCuestionarioGrupoUseCase.execute(data);
            
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename=reporte-grupo.pdf");
            return res.send(pdf);
        } catch (error) {
            console.error('❌ Error en previewCuestionarioGrupo:', error);
            next(error);
        }
    };

    public downloadCuestionarioGrupo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('⬇️ Download grupo - cuestionario:', req.params.cuestionario_id);
            
            const data = ObtenerRespuestaDocenteCuestionarioSchema.parse({
                cuestionario_id: Number(req.params.cuestionario_id),
            });
            
            const pdf = await this.generarReporteCuestionarioGrupoUseCase.execute(data);
            
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=reporte-grupo-${data.cuestionario_id}.pdf`);
            return res.send(pdf);
        } catch (error) {
            console.error('❌ Error en downloadCuestionarioGrupo:', error);
            next(error);
        }
    };
}