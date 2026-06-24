import { ModuleRoute } from "../../../../presentation/router/module-route.js";
import { buildReporteDependencies } from "../../dependencies/reporte.dependencies.builder.js";
import { ReporteDependencies } from "../../dependencies/reporte.dependencies.js";
import { buildReporteModule } from "../../reporte.module.js";

export const moduleRoute:
  ModuleRoute<ReporteDependencies> = {
  name: 'reporte',
  basePath: '/reporte',
  buildDependencies: buildReporteDependencies,
  createRouter: buildReporteModule

};