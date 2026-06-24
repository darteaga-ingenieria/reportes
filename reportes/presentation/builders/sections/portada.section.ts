import fs from 'fs';
import path from 'path';
import { Content } from 'pdfmake/interfaces.js';
import { ReporteCuestionarioDocenteDto } from '../../../application/dto/reporte-cuestionario-docente.dto.js';

export class PortadaSection {
    static build(data: ReporteCuestionarioDocenteDto): Content[] {
        const fecha = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

        let logoBase64 = '';
        try {
            const logoPath = path.resolve(process.cwd(), 'src/shared/pdf/assets/logo-colegio.png');
            if (fs.existsSync(logoPath)) {
                logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
            }
        } catch {}

        return [{
            margin: [0, 80, 0, 0],
            stack: [
                logoBase64 ? { image: logoBase64, width: 150, alignment: 'center', margin: [0, 0, 0, 20] } : { text: '' },
                { text: 'REPORTE DE EVALUACIÓN DOCENTE', style: 'portadaTitle', alignment: 'center' },
                { text: 'Cuestionario Docente', alignment: 'center', fontSize: 16, color: '#4B5563', margin: [0, 0, 0, 30] },
                { canvas: [{ type: 'line', x1: 100, y1: 0, x2: 500, y2: 0, lineWidth: 2, lineColor: '#800000' }], margin: [0, 0, 0, 40] },
                {
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            ['Cuestionario:', data.cuestionarioNombre],
                            ['Docente:', `${data.docenteNombre} ${data.docenteApellido}`],
                            ['Curso:', data.cursoNombre],
                            ['Sección:', data.seccionNombre],
                            ['Periodo:', data.periodoNombre],
                            ['Año:', data.anio.toString()],
                            ['Unidad:', data.unidad]
                        ]
                    },
                    layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingTop: () => 5, paddingBottom: () => 5 },
                    margin: [50, 20, 50, 40]
                },
                { text: `Fecha de generación: ${fecha}`, alignment: 'center', fontSize: 11, color: '#6B7280' },
                { text: 'Este reporte es generado automáticamente', alignment: 'center', fontSize: 9, color: '#9CA3AF', margin: [0, 5, 0, 0] }
            ]
        }, { text: '', pageBreak: 'after' }];
    }
}