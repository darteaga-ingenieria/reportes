import { Content } from 'pdfmake/interfaces.js';
import { ReporteCuestionarioDocenteDto } from '../../../application/dto/reporte-cuestionario-docente.dto.js';

export class InformacionGeneralSection {
    static build(data: ReporteCuestionarioDocenteDto): Content[] {
        const fecha = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });

        return [
            { text: 'INFORMACIÓN GENERAL', style: 'subtitle', margin: [0, 0, 0, 15] },
            {
                columns: [
                    { text: `Fecha: ${fecha}`, style: 'info' },
                    { text: `Total invitaciones: ${data.totalInvitaciones}`, alignment: 'right', style: 'info' }
                ],
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    widths: [120, '*'],
                    body: [
                        ['Cuestionario:', data.cuestionarioNombre],
                        ['Año:', data.anio.toString()],
                        ['Unidad:', data.unidad],
                        ['Periodo:', data.periodoNombre],
                        ['Docente:', `${data.docenteNombre} ${data.docenteApellido}`],
                        ['Curso:', data.cursoNombre],
                        ['Sección:', data.seccionNombre],
                        ['Destino:', `${data.destinoTipo}: ${data.destinoNombre}`]
                    ]
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#D1D5DB',
                    vLineColor: () => '#D1D5DB',
                    paddingTop: () => 5,
                    paddingBottom: () => 5,
                    paddingLeft: () => 8
                },
                margin: [0, 0, 0, 20]
            }
        ];
    }
}