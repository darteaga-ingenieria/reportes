import fs from 'fs';
import path from 'path';
import { Content } from 'pdfmake/interfaces.js';

export class HeaderSection {
    static build(currentPage: number, pageCount: number): Content {
        // No mostrar en portada
        if (currentPage === 1) return { text: '' };

        try {
            const logoPath = path.resolve(process.cwd(), 'src/shared/pdf/assets/logo-colegio.png');
            let logoBase64 = '';
            if (fs.existsSync(logoPath)) {
                logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
            }

            return {
                margin: [30, 15, 30, 5],
                columns: [
                    {
                        width: 'auto',
                        stack: [
                            logoBase64 ? { image: logoBase64, width: 50 } : { text: '' },
                            { text: 'Sistema de Encuestas', fontSize: 8, bold: true, color: '#800000' }
                        ]
                    },
                    {
                        width: '*',
                        stack: [
                            { text: 'REPORTE DE CUESTIONARIO DOCENTE', alignment: 'right', fontSize: 10, bold: true, color: '#800000' },
                            { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 8, color: '#666' }
                        ]
                    }
                ],
                marginBottom: 5,
                decoration: 'underline',
                decorationColor: '#800000'
            };
        } catch {
            // Fallback sin logo
            return {
                margin: [30, 15, 30, 5],
                columns: [
                    { text: 'Sistema de Encuestas', fontSize: 10, bold: true, color: '#800000' },
                    { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 8, color: '#666' }
                ],
                marginBottom: 5,
                decoration: 'underline',
                decorationColor: '#800000'
            };
        }
    }
}