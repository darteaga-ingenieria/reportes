// src/modules/reporte/presentation/swagger/reporte.swagger.ts

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ObtenerUsuarioSubgrupoSchema, ObtenerRespuestaDocenteCuestionarioSchema } from "../validation/usuario-subgrupo.schema.js";

export const registerSwagger = (registry: OpenAPIRegistry) => {

  // ==================== COLABORADORES ====================
  registry.registerPath({
    method: "get",
    path: "/reporte/colaboradores/preview",
    tags: ["Reporte"],
    summary: "Vista previa del reporte de colaboradores",
    description: 'Muestra el PDF directamente en el navegador.',
    responses: {
      200: {
        description: "PDF generado correctamente"
      },
      500: {
        description: "Error interno"
      }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/reporte/colaboradores/download',
    tags: ['Reporte'],
    summary: 'Descargar reporte de colaboradores',
    description: 'Descarga el PDF de colaboradores.',
    responses: {
      200: {
        description: 'PDF descargado correctamente'
      },
      500: {
        description: 'Error interno'
      }
    }
  });

  // ==================== EVALUADORES ====================
  registry.registerPath({
    method: 'get',
    path: '/reporte/evaluadores/preview/{usuario_subgrupo_evaluado_id}',
    tags: ['Reporte'],
    request: {
      params: ObtenerUsuarioSubgrupoSchema,
    },
    summary: 'Vista previa del reporte de usuario subgrupo',
    description: 'Vista previa del PDF de usuario subgrupo.',
    responses: {
      200: {
        description: 'PDF generado correctamente'
      },
      500: {
        description: 'Error interno'
      }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/reporte/evaluadores/download/{usuario_subgrupo_evaluado_id}',
    tags: ['Reporte'],
    request: {
      params: ObtenerUsuarioSubgrupoSchema,
    },
    summary: 'Descargar reporte de usuario subgrupo',
    description: 'Descarga el PDF de usuario subgrupo.',
    responses: {
      200: {
        description: 'PDF descargado correctamente'
      },
      500: {
        description: 'Error interno'
      }
    }
  });

  // ==================== CUESTIONARIO DOCENTE - INDIVIDUAL ====================
  registry.registerPath({
    method: 'get',
    path: '/reporte/cuestionario/preview/{cuestionario_id}',
    tags: ['Reporte'],
    request: {
      params: ObtenerRespuestaDocenteCuestionarioSchema,
    },
    summary: 'Vista previa del reporte individual de cuestionario docente',
    description: 'Vista previa del PDF de cuestionario para un solo docente.',
    responses: {
      200: {
        description: 'PDF generado correctamente'
      },
      500: {
        description: 'Error interno'
      }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/reporte/cuestionario/download/{cuestionario_id}',
    tags: ['Reporte'],
    request: {
      params: ObtenerRespuestaDocenteCuestionarioSchema,
    },
    summary: 'Descargar reporte individual de cuestionario docente',
    description: 'Descarga el PDF de cuestionario para un solo docente.',
    responses: {
      200: {
        description: 'PDF descargado correctamente'
      },
      500: {
        description: 'Error interno'
      }
    }
  });

  // ==================== ✅ NUEVO: CUESTIONARIO DOCENTE - GRUPO (RANKING) ====================
  registry.registerPath({
    method: 'get',
    path: '/reporte/cuestionario/grupo/preview/{cuestionario_id}',
    tags: ['Reporte'],
    request: {
      params: ObtenerRespuestaDocenteCuestionarioSchema,
    },
    summary: 'Vista previa del reporte de grupo de cuestionario docente',
    description: 'Genera un PDF con el ranking y reportes individuales de TODOS los docentes evaluados en un cuestionario.',
    responses: {
      200: {
        description: 'PDF generado correctamente'
      },
      404: {
        description: 'No se encontraron respuestas para este cuestionario'
      },
      500: {
        description: 'Error interno'
      }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/reporte/cuestionario/grupo/download/{cuestionario_id}',
    tags: ['Reporte'],
    request: {
      params: ObtenerRespuestaDocenteCuestionarioSchema,
    },
    summary: 'Descargar reporte de grupo de cuestionario docente',
    description: 'Descarga un PDF con el ranking y reportes individuales de TODOS los docentes evaluados en un cuestionario.',
    responses: {
      200: {
        description: 'PDF descargado correctamente'
      },
      404: {
        description: 'No se encontraron respuestas para este cuestionario'
      },
      500: {
        description: 'Error interno'
      }
    }
  });
}