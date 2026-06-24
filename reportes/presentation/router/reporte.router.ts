import { Router } from "express";
import { ReporteController } from "../controller/reporte.controller.js";

export const createReporteRouter = (controller: ReporteController): Router => {
    const router = Router();

    // Reportes existentes
    router.get('/colaboradores/preview', controller.previewColaboradores);
    router.get('/colaboradores/download', controller.downloadColaboradores);
    router.get('/evaluadores/preview/:usuario_subgrupo_evaluado_id', controller.previewEvaluadores);
    router.get('/evaluadores/download/:usuario_subgrupo_evaluado_id', controller.downloadEvaluadores);

    // ✅ REPORTE INDIVIDUAL DE CUESTIONARIO DOCENTE
    router.get('/cuestionario/preview/:cuestionario_id', controller.previewCuestionarioDocentes);
    router.get('/cuestionario/download/:cuestionario_id', controller.downloadCuestionarioDocentes);

    // ✅ REPORTE DE GRUPO DE CUESTIONARIO DOCENTE (RANKING)
    router.get('/cuestionario/grupo/preview/:cuestionario_id', controller.previewCuestionarioGrupo);
    router.get('/cuestionario/grupo/download/:cuestionario_id', controller.downloadCuestionarioGrupo);

    return router;
}