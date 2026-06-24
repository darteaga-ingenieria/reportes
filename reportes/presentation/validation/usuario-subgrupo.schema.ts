import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { Etiqueta } from "../../../etiqueta/domain/etiqueta.entity.js";

extendZodWithOpenApi(z);

export const ObtenerUsuarioSubgrupoSchema = z
    .object({
        usuario_subgrupo_evaluado_id: z.number().int().positive('el id debe de ser valido'),
    })
    .openapi('ObtenerUsuarioSubgrupoSchema');

export const ObtenerRespuestaDocenteCuestionarioSchema = z
    .object({
        cuestionario_id: z.number().int().positive('el id debe de ser valido'),
    })
    .openapi('ObtenerRespuestaDocenteCuestionarioSchema');