import { Content } from 'pdfmake/interfaces.js';

export class FooterSection {
    static build(currentPage: number, pageCount: number): Content {
        if (currentPage === 1) return { text: '' };

        return {
            margin: [30, 10, 30, 0],
            columns: [
                { text: 'Generado automáticamente', fontSize: 8, color: '#666' },
                { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 8, color: '#666' }
            ]
        };
    }
}