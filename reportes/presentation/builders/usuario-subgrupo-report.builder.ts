import fs from 'fs';
import path from 'path';
import { IPdfBuilder } from '../../domain/pdf.builder.interface.js';
import { ReporteUsuarioSubgrupoDto } from '../../application/dto/reporte-usuario-subgrupo.dto.js';

const HEADER_BG = '#800000';
const BORDER_GRAY = '#D1D5DB';

export class UsuarioSubgrupoReportBuilder implements IPdfBuilder<ReporteUsuarioSubgrupoDto> {

    public build(data: ReporteUsuarioSubgrupoDto): any {

        const logoPath = path.resolve(
            process.cwd(),
            'src/shared/pdf/assets/logo-colegio.png'
        );

        const logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;

        const fecha = new Date().toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return {

            pageSize: 'A4',
            pageMargins: [30, 60, 30, 50],

            header: {
                margin: [30, 20, 30, 0],
                columns: [
                    {
                        image: logoBase64,
                        width: 120
                    },
                    {
                        text: 'SISTEMA DE ENCUESTAS',
                        style: 'headerTitle',
                        alignment: 'right'
                    }
                ]
            },

            footer: (currentPage: number, pageCount: number) => ({
                margin: [30, 10, 30, 0],
                columns: [
                    {
                        text: 'Generado automáticamente',
                        fontSize: 8,
                        color: '#6B7280'
                    },
                    {
                        text: `Página ${currentPage} de ${pageCount}`,
                        alignment: 'right',
                        fontSize: 8,
                        color: '#6B7280'
                    }
                ]
            }),

            content: [

                {
                    text: 'REPORTE DE EVALUADORES',
                    style: 'title'
                },

                {
                    margin: [0, 15, 0, 0],
                    columns: [
                        {
                            text: `Fecha de generación: ${fecha}`,
                            style: 'info'
                        },
                        {
                            text: `Total evaluadores: ${data.totalEvaluadores}`,
                            alignment: 'right',
                            style: 'info'
                        }
                    ]
                },

                {
                    margin: [0, 20, 0, 10],
                    table: {
                        widths: [130, '*' , '*'],
                        body: [
                            [
                                { text: 'Periodo', style: 'label' },
                                { text: data.periodo }
                            ],
                            [
                                { text: 'Subgrupo', style: 'label' },
                                { text: data.subgrupo }
                            ],
                            [
                                { text: 'Evaluado', style: 'label' },
                                { text: `${data.nombreUsuario} ${data.apellidoUsuario}`}
                            ]

                        ]
                    },
                    layout: 'lightHorizontalLines'
                },

                {
                    margin: [0, 20, 0, 0],
                    table: {
                        headerRows: 1,
                        widths: [50, '*', '*'],
                        body: [

                            [
                                {
                                    text: 'N°',
                                    style: 'tableHeader'
                                },
                                {
                                    text: 'NOMBRE EVALUADOR',
                                    style: 'tableHeader'
                                },
                                {
                                    text: 'APELLIDO EVALUADOR',
                                    style: 'tableHeader'
                                }

                            ],

                            ...data.evaluadores.map(e => [

                                {
                                    text: e.numero.toString(),
                                    alignment: 'center'
                                },

                                {
                                    text: e.nombre
                                },
                                {
                                    text: e.apellido
                                }

                            ])

                        ]
                    },

                    layout: {

                        fillColor: (rowIndex: number) => {

                            if (rowIndex === 0)
                                return HEADER_BG;

                            return rowIndex % 2 === 0
                                ? '#F9FAFB'
                                : null;
                        },

                        hLineColor: () => BORDER_GRAY,
                        vLineColor: () => BORDER_GRAY,
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0.5,
                        paddingLeft: () => 8,
                        paddingRight: () => 8,
                        paddingTop: () => 2,
                        paddingBottom: () => 2

                    }

                }

            ],

            styles: {

                headerTitle: {
                    fontSize: 12,
                    bold: true,
                    color: '#800000'
                },

                title: {
                    fontSize: 18,
                    decoration: 'underline',
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 15]
                },

                info: {
                    fontSize: 10
                },

                label: {
                    bold: true
                },

                tableHeader: {
                    bold: true,
                    color: '#FFFFFF',
                    alignment: 'center'
                }

            },

            defaultStyle: {
                fontSize: 9
            }

        };

    }

}