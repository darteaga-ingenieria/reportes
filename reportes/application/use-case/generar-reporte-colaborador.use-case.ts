import { UsuarioTipoColaboradorRepository } from "../../../usuario-tipo-colaborador/domain/usuario-tipo-colaborador.repository.interface.js";
import { PdfService } from "../../../../shared/pdf/pdf.service.js";
import { ColaboradorReportBuilder } from "../../presentation/builders/colaborador-report.builder.js";

export class GenerarReporteColaboradorUseCase {
  constructor(
    private readonly repository: UsuarioTipoColaboradorRepository,
    private readonly pdfService: PdfService,
    private readonly pdfColaborador: ColaboradorReportBuilder
  ) { }
  public async execute(): Promise<Buffer> {
    const usuarios = await this.repository.getAllUsuarioColaborador();
    const colaboradores = usuarios.map(u => ({
      id_externo: u.id_externo,
      nombre: u.nombre,
      apellido: u.apellido,
      tipo_usuario: u.tipo_usuario,
      unidad:
        u.unidad
        .map(x => x.nombre)
        .join(', ')
    }));

    const definition = this.pdfColaborador.build({ colaboradores });
    return await this.pdfService.generar( definition );
  }
}