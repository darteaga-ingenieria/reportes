// presentation/builders/sections/ranking.section.ts
import { Content } from 'pdfmake/interfaces.js';

import { RankingItemDto } from '../../../application/dto/reporte-cuestionario-docente.dto.js';
export class RankingSection {
    static build(ranking: RankingItemDto[]): Content[] {
        if (!ranking || ranking.length === 0) {
            return [{ text: 'No hay datos para el ranking', italics: true }];
        }

        return [
            { text: 'RANKING DE DOCENTES', style: 'title', margin: [0, 0, 0, 15] },
            {
                table: {
                    headerRows: 1,
                    widths: [40, 60, '*', '*', 70],
                    body: [
                        [
                            { text: 'N°', style: 'tableHeader', alignment: 'center' },
                            { text: 'Curso', style: 'tableHeader', alignment: 'center' },
                            { text: 'Docente', style: 'tableHeader' },
                            { text: 'Sección', style: 'tableHeader', alignment: 'center' },
                            { text: 'Puntaje', style: 'tableHeader', alignment: 'center' }
                        ],
                        ...ranking.map((item) => [
                            { 
                                text: item.posicion.toString(), 
                                alignment: 'center',
                                bold: item.posicion <= 3
                            },
                            item.curso,
                            item.nombre,
                            item.seccion,
                            { 
                                text: item.puntaje.toFixed(2), 
                                alignment: 'center',
                                bold: true,
                                color: this.getColorByPosition(item.posicion)
                            }
                        ])
                    ]
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        if (rowIndex === 0) return '#800000';
                        if (rowIndex === 1) return '#FEF3C7';  // Oro
                        if (rowIndex === 2) return '#E5E7EB';  // Plata
                        if (rowIndex === 3) return '#FDE68A';  // Bronce
                        return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                    },
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#D1D5DB',
                    vLineColor: () => '#D1D5DB'
                }
            }
        ];
    }

    private static getColorByPosition(posicion: number): string {
        if (posicion === 1) return '#B45309';  // Oro
        if (posicion === 2) return '#6B7280';  // Plata
        if (posicion === 3) return '#92400E';  // Bronce
        return '#1F2937';
    }
}