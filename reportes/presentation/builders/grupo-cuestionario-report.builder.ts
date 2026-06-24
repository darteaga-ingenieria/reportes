import { TDocumentDefinitions, Content, StyleDictionary } from 'pdfmake/interfaces.js';
import { ReporteCuestionarioGrupoDto } from '../../application/dto/reporte-cuestionario-docente-grupo.dto.js';
import { HeaderSection } from './sections/header.section.js';
import { FooterSection } from './sections/footer.section.js';
import { PdfStyles } from './styles/pdf.styles.js';

export class GrupoCuestionarioReportBuilder {

    build(data: ReporteCuestionarioGrupoDto): TDocumentDefinitions {
        console.log('📄 Construyendo reporte de grupo...');

        if (!data || !data.docentes || data.docentes.length === 0) {
            throw new Error('No hay datos de docentes para generar el reporte');
        }

        const content: Content[] = [];

        content.push(...this.buildPortada(data));
        content.push(...this.buildInstrumento(data.preguntas));
        content.push(...this.buildRanking(data.ranking));

        for (let i = 0; i < data.docentes.length; i++) {
            if (i > 0) {
                content.push({ text: '', pageBreak: 'before' });
            }
            content.push(...this.buildReportePersonal(data.docentes[i]));
        }

        return {
            content: content,
            styles: this.getStyles() as any,
            header: (currentPage: number, pageCount: number) => {
                if (currentPage === 1) return { text: '' };
                return HeaderSection.build(currentPage, pageCount);
            },
            footer: (currentPage: number, pageCount: number) => {
                if (currentPage === 1) return { text: '' };
                return FooterSection.build(currentPage, pageCount);
            },
            pageMargins: [40, 80, 40, 40],
            pageSize: 'A4',
            defaultStyle: {
                fontSize: 10,
                color: '#333333'
            }
        };
    }

    private buildPortada(data: ReporteCuestionarioGrupoDto): Content[] {
        const fecha = new Date().toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return [{
            margin: [0, 80, 0, 0],
            stack: [
                {
                    text: 'REPORTE DE EVALUACIÓN DOCENTE',
                    style: 'portadaTitle',
                    alignment: 'center'
                },
                {
                    text: data.cuestionarioNombre || 'Cuestionario sin nombre',
                    alignment: 'center',
                    fontSize: 18,
                    margin: [0, 10, 0, 30],
                    bold: true
                },
                {
                    canvas: [{
                        type: 'line',
                        x1: 100,
                        y1: 0,
                        x2: 500,
                        y2: 0,
                        lineWidth: 2,
                        lineColor: '#800000'
                    }],
                    margin: [0, 0, 0, 30]
                },
                {
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            [{ text: 'Periodo:', bold: true }, { text: data.periodoNombre || 'Sin periodo' }],
                            [{ text: 'Año:', bold: true }, { text: data.anio?.toString() || '0' }],
                            [{ text: 'Unidad:', bold: true }, { text: data.unidad || 'Sin unidad' }],
                            [{ text: 'Total docentes:', bold: true }, { text: data.totalDocentes?.toString() || '0' }],
                            [{ text: 'Total invitaciones:', bold: true }, { text: data.totalInvitaciones?.toString() || '0' }]
                        ]
                    },
                    layout: {
                        hLineWidth: () => 0,
                        vLineWidth: () => 0,
                        paddingTop: () => 5,
                        paddingBottom: () => 5,
                        paddingLeft: () => 20
                    },
                    margin: [50, 20, 50, 30]
                },
                {
                    text: `Fecha de generación: ${fecha}`,
                    alignment: 'center',
                    fontSize: 11,
                    color: '#6B7280'
                },
                {
                    text: 'Sistema de Encuestas - Generado automáticamente',
                    alignment: 'center',
                    fontSize: 9,
                    color: '#9CA3AF',
                    margin: [0, 5, 0, 0]
                }
            ]
        }, { text: '', pageBreak: 'after' }];
    }

    private buildInstrumento(preguntas: any[]): Content[] {
        if (!preguntas || preguntas.length === 0) {
            return [];
        }

        const content: Content[] = [
            { text: 'INSTRUMENTO DE EVALUACIÓN', style: 'title', margin: [0, 0, 0, 15] }
        ];

        const preguntasEscala = preguntas.filter(p => p.tipoPreguntaId === 1);
        const preguntasTexto = preguntas.filter(p => p.tipoPreguntaId === 2);

        if (preguntasEscala.length > 0) {
            // Construir body con tipo any para evitar conflictos de TypeScript
            const body: any[] = [
                [
                    { text: 'N°', style: 'tableHeader', alignment: 'center' },
                    { text: 'Pregunta', style: 'tableHeader' }
                ]
            ];

            for (const p of preguntasEscala) {
                body.push([
                    { text: p.orden?.toString() || '0', alignment: 'center' },
                    { text: p.preguntaTexto || 'Sin texto' }
                ]);
            }

            content.push(
                { text: 'Preguntas de Escala', style: 'subtitle', margin: [0, 10, 0, 5] },
                {
                    table: {
                        headerRows: 1,
                        widths: [40, '*'],
                        body: body
                    },
                    layout: {
                        fillColor: (rowIndex: number) => {
                            if (rowIndex === 0) return '#800000';
                            return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                        },
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0.5,
                        hLineColor: () => '#D1D5DB',
                        vLineColor: () => '#D1D5DB'
                    },
                    margin: [0, 0, 0, 15]
                }
            );
        }

        if (preguntasTexto.length > 0) {
            const body: any[] = [
                [
                    { text: 'N°', style: 'tableHeader', alignment: 'center' },
                    { text: 'Pregunta', style: 'tableHeader' }
                ]
            ];

            for (const p of preguntasTexto) {
                body.push([
                    { text: p.orden?.toString() || '0', alignment: 'center' },
                    { text: p.preguntaTexto || 'Sin texto' }
                ]);
            }

            content.push(
                { text: 'Preguntas Abiertas', style: 'subtitle', margin: [0, 10, 0, 5] },
                {
                    table: {
                        headerRows: 1,
                        widths: [40, '*'],
                        body: body
                    },
                    layout: {
                        fillColor: (rowIndex: number) => {
                            if (rowIndex === 0) return '#800000';
                            return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                        },
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0.5,
                        hLineColor: () => '#D1D5DB',
                        vLineColor: () => '#D1D5DB'
                    },
                    margin: [0, 0, 0, 15]
                }
            );
        }

        // Escala de valoración
        const escalaBody: any[] = [
            [
                { text: 'Muy malo', alignment: 'center', fillColor: '#EF4444', color: '#FFFFFF', bold: true },
                { text: 'Malo', alignment: 'center', fillColor: '#F97316', color: '#FFFFFF', bold: true },
                { text: 'Regular', alignment: 'center', fillColor: '#F59E0B', color: '#FFFFFF', bold: true },
                { text: 'Bueno', alignment: 'center', fillColor: '#3B82F6', color: '#FFFFFF', bold: true },
                { text: 'Muy bueno', alignment: 'center', fillColor: '#10B981', color: '#FFFFFF', bold: true }
            ],
            [
                { text: '1', alignment: 'center' },
                { text: '2', alignment: 'center' },
                { text: '3', alignment: 'center' },
                { text: '4', alignment: 'center' },
                { text: '5', alignment: 'center' }
            ]
        ];

        content.push(
            { text: 'Escala de Valoración', style: 'subtitle', margin: [0, 10, 0, 5] },
            {
                table: {
                    widths: ['*', '*', '*', '*', '*'],
                    body: escalaBody
                },
                layout: 'noBorders',
                margin: [0, 0, 0, 20]
            },
            { text: '', pageBreak: 'after' }
        );

        return content;
    }

    private buildRanking(ranking: any[]): Content[] {
        if (!ranking || ranking.length === 0) {
            return [{ text: 'No hay datos para el ranking', italics: true, margin: [0, 20, 0, 0] }];
        }

        const body: any[] = [
            [
                { text: 'N°', style: 'tableHeader', alignment: 'center' },
                { text: 'Docente', style: 'tableHeader' },
                { text: 'Curso', style: 'tableHeader' },
                { text: 'Sección', style: 'tableHeader', alignment: 'center' },
                { text: 'Puntaje', style: 'tableHeader', alignment: 'center' }
            ]
        ];

        for (const item of ranking) {
            const posicion = item.posicion || 0;
            let color = '#1F2937';

            if (posicion === 1) color = '#B45309';
            else if (posicion === 2) color = '#6B7280';
            else if (posicion === 3) color = '#92400E';

            body.push([
                {
                    text: posicion.toString(),
                    alignment: 'center',
                    bold: posicion <= 3,
                    color: color
                },
                { text: item.nombre || 'Sin nombre' },
                { text: item.curso || 'Sin curso' },
                { text: item.seccion || 'Sin sección', alignment: 'center' },
                {
                    text: (item.puntaje || 0).toFixed(2),
                    alignment: 'center',
                    bold: true,
                    color: color
                }
            ]);
        }

        return [
            { text: 'RANKING DE DOCENTES', style: 'title', margin: [0, 0, 0, 15] },
            {
                table: {
                    headerRows: 1,
                    widths: [40, '*', '*', '*', 70],
                    body: body
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        if (rowIndex === 0) return '#800000';
                        if (rowIndex === 1) return '#FEF3C7';
                        if (rowIndex === 2) return '#E5E7EB';
                        if (rowIndex === 3) return '#FDE68A';
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

    private buildReportePersonal(docente: any): Content[] {
        if (!docente) {
            return [{ text: 'No hay datos del docente', italics: true }];
        }

        const content: Content[] = [];

        // Encabezado
        content.push({
            columns: [
                {
                    stack: [
                        {
                            text: `${docente.docenteNombre || ''} ${docente.docenteApellido || ''}`.trim() || 'Docente sin nombre',
                            style: 'subtitle',
                            fontSize: 16
                        },
                        {
                            text: docente.cursoNombre || 'Sin curso',
                            fontSize: 12,
                            color: '#4B5563'
                        },
                        {
                            text: `Sección: ${docente.seccionNombre || 'Sin sección'}`,
                            fontSize: 12,
                            color: '#4B5563'
                        }
                    ],
                    width: '*'
                },
                {
                    stack: [
                        {
                            text: `Puntaje: ${(docente.puntajeTotal || 0).toFixed(2)}`,
                            alignment: 'right',
                            fontSize: 18,
                            bold: true,
                            color: this.getColorByPuntaje(docente.puntajeTotal || 0)
                        },
                        {
                            text: `Evaluado por: ${docente.totalInvitaciones || 0} personas`,
                            alignment: 'right',
                            fontSize: 10,
                            color: '#6B7280'
                        }
                    ],
                    width: 'auto'
                }
            ],
            margin: [0, 0, 0, 15]
        });

        // Puntajes por pregunta
        if (docente.puntajePorPregunta && docente.puntajePorPregunta.length > 0) {
            const body: any[] = [
                [
                    { text: 'N°', style: 'tableHeader', alignment: 'center' },
                    { text: 'Pregunta', style: 'tableHeader' },
                    { text: 'Promedio', style: 'tableHeader', alignment: 'center' }
                ]
            ];

            for (const p of docente.puntajePorPregunta) {
                body.push([
                    { text: p.orden?.toString() || '0', alignment: 'center' },
                    { text: p.preguntaTexto || 'Sin texto' },
                    {
                        text: (p.promedio || 0).toFixed(2),
                        alignment: 'center',
                        bold: true,
                        color: this.getColorByPuntaje(p.promedio || 0)
                    }
                ]);
            }

            content.push({
                table: {
                    headerRows: 1,
                    widths: [40, '*', 70],
                    body: body
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        if (rowIndex === 0) return '#800000';
                        return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                    },
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#D1D5DB',
                    vLineColor: () => '#D1D5DB'
                },
                margin: [0, 0, 0, 15]
            });
        }

        // Comentarios
        if (docente.comentarios && docente.comentarios.length > 0) {
            content.push({
                text: 'Comentarios:',
                style: 'label',
                margin: [0, 10, 0, 5]
            });

            for (const c of docente.comentarios) {
                content.push({
                    text: `• ${c.comentario || 'Sin comentario'}`,
                    fontSize: 9,
                    color: '#4B5563',
                    margin: [0, 2, 0, 2]
                });
            }
        }

        return content;
    }

    private getColorByPuntaje(puntaje: number): string {
        if (puntaje >= 4.5) return '#10B981';
        if (puntaje >= 3.5) return '#3B82F6';
        if (puntaje >= 2.5) return '#F59E0B';
        if (puntaje >= 1.5) return '#F97316';
        return '#EF4444';
    }

    private getStyles() {
        return {
            portadaTitle: {
                fontSize: 24,
                bold: true,
                color: '#800000',
                alignment: 'center'
            },
            title: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 20, 0, 15]
            },
            subtitle: {
                fontSize: 14,
                bold: true,
                color: '#800000',
                margin: [0, 15, 0, 10]
            },
            label: {
                fontSize: 12,
                bold: true,
                color: '#374151'
            },
            tableHeader: {
                bold: true,
                color: '#FFFFFF',
                alignment: 'center',
                fillColor: '#800000',
                fontSize: 10,
                margin: [5, 5, 5, 5]
            },
            info: {
                fontSize: 10,
                color: '#4B5563'
            }
        };
    }
}