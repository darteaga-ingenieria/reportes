// presentation/builders/sections/reporte-personal.section.ts
import { Content } from 'pdfmake/interfaces.js';
import { DocenteReporteDto, PreguntaInstrumentoDto } from '../../../application/dto/reporte-cuestionario-docente-grupo.dto.js';

export class ReportePersonalSection {
    static build(docente: DocenteReporteDto, preguntas: PreguntaInstrumentoDto[]): Content[] {
        return [
            {
                stack: [
                    // Encabezado
                    {
                        columns: [
                            {
                                stack: [
                                    { 
                                        text: `${docente.docenteNombre} ${docente.docenteApellido}`,
                                        style: 'subtitle'
                                    },
                                    { 
                                        text: docente.cursoNombre,
                                        fontSize: 12,
                                        color: '#4B5563'
                                    },
                                    { 
                                        text: `Sección: ${docente.seccionNombre}`,
                                        fontSize: 12,
                                        color: '#4B5563'
                                    }
                                ],
                                width: '*'
                            },
                            {
                                stack: [
                                    { 
                                        text: `Puntaje: ${docente.puntajeTotal.toFixed(2)}`,
                                        alignment: 'right',
                                        fontSize: 16,
                                        bold: true,
                                        color: this.getColorByPuntaje(docente.puntajeTotal)
                                    },
                                    { 
                                        text: `Evaluado por: ${docente.totalInvitaciones} personas`,
                                        alignment: 'right',
                                        fontSize: 10,
                                        color: '#6B7280'
                                    }
                                ],
                                width: 'auto'
                            }
                        ],
                        margin: [0, 0, 0, 15]
                    },

                    // Tabla de puntajes por pregunta
                    this.buildTablaPuntajes(docente.puntajePorPregunta),

                    // Resumen de respuestas por valor
                    this.buildResumenRespuestas(docente.respuestasEscala, preguntas),

                    // Comentarios
                    this.buildComentarios(docente.comentarios)
                ]
            }
        ];
    }

    private static buildTablaPuntajes(puntajes: any[]): Content {
        if (!puntajes || puntajes.length === 0) {
            return { text: 'No hay puntajes disponibles', italics: true, color: '#6B7280' };
        }

        return {
            table: {
                headerRows: 1,
                widths: [40, '*', 70, 70],
                body: [
                    [
                        { text: 'N°', style: 'tableHeader', alignment: 'center' },
                        { text: 'Pregunta', style: 'tableHeader' },
                        { text: 'Promedio', style: 'tableHeader', alignment: 'center' },
                        { text: 'Respuestas', style: 'tableHeader', alignment: 'center' }
                    ],
                    ...puntajes.map(p => [
                        { text: p.orden.toString(), alignment: 'center' },
                        p.preguntaTexto,
                        { 
                            text: p.promedio.toFixed(2), 
                            alignment: 'center',
                            bold: true,
                            color: this.getColorByValor(p.promedio)
                        },
                        { text: p.total.toString(), alignment: 'center' }
                    ])
                ]
            },
            layout: {
                fillColor: (rowIndex: number) => {
                    if (rowIndex === 0) return '#800000';
                    return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                }
            },
            margin: [0, 10, 0, 10]
        };
    }

    private static buildResumenRespuestas(respuestas: any[], preguntas: PreguntaInstrumentoDto[]): Content {
        if (!respuestas || respuestas.length === 0) {
            return { text: '' };
        }

        // Agrupar por pregunta
        const respuestasPorPregunta = new Map<number, any[]>();
        for (const r of respuestas) {
            if (!respuestasPorPregunta.has(r.preguntaId)) {
                respuestasPorPregunta.set(r.preguntaId, []);
            }
            respuestasPorPregunta.get(r.preguntaId)!.push(r);
        }

        const body: any[] = [
            [
                { text: 'Pregunta', style: 'tableHeader' },
                { text: 'Muy malo (1)', style: 'tableHeader', alignment: 'center' },
                { text: 'Malo (2)', style: 'tableHeader', alignment: 'center' },
                { text: 'Regular (3)', style: 'tableHeader', alignment: 'center' },
                { text: 'Bueno (4)', style: 'tableHeader', alignment: 'center' },
                { text: 'Muy bueno (5)', style: 'tableHeader', alignment: 'center' }
            ]
        ];

        const preguntasEscala = preguntas.filter(p => p.tipoPreguntaId === 1);
        
        for (const pregunta of preguntasEscala) {
            const respuestasPregunta = respuestasPorPregunta.get(pregunta.preguntaId) || [];
            const conteo = this.contarValores(respuestasPregunta);
            
            body.push([
                { text: pregunta.preguntaTexto, fontSize: 9 },
                { text: conteo[1]?.toString() || '0', alignment: 'center' },
                { text: conteo[2]?.toString() || '0', alignment: 'center' },
                { text: conteo[3]?.toString() || '0', alignment: 'center' },
                { text: conteo[4]?.toString() || '0', alignment: 'center' },
                { text: conteo[5]?.toString() || '0', alignment: 'center' }
            ]);
        }

        return {
            table: {
                headerRows: 1,
                widths: ['*', 50, 50, 50, 50, 50],
                body: body
            },
            layout: {
                fillColor: (rowIndex: number) => {
                    if (rowIndex === 0) return '#800000';
                    return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                }
            },
            margin: [0, 10, 0, 10]
        };
    }

    private static contarValores(respuestas: any[]): Map<number, number> {
        const conteo = new Map<number, number>();
        for (const r of respuestas) {
            const valor = r.valor;
            conteo.set(valor, (conteo.get(valor) || 0) + 1);
        }
        return conteo;
    }

    private static buildComentarios(comentarios: any[]): Content {
        if (!comentarios || comentarios.length === 0) {
            return { text: 'Sin comentarios', italics: true, color: '#6B7280', margin: [0, 10, 0, 0] };
        }

        return {
            stack: [
                { 
                    text: 'Comentarios:', 
                    style: 'label', 
                    margin: [0, 10, 0, 5] 
                },
                ...comentarios.map(c => ({
                    text: `• ${c.comentario}`,
                    fontSize: 9,
                    color: '#4B5563',
                    margin: [0, 2, 0, 2]
                }))
            ]
        };
    }

    private static getColorByPuntaje(puntaje: number): string {
        if (puntaje >= 4.5) return '#10B981';
        if (puntaje >= 3.5) return '#3B82F6';
        if (puntaje >= 2.5) return '#F59E0B';
        if (puntaje >= 1.5) return '#F97316';
        return '#EF4444';
    }

    private static getColorByValor(valor: number): string {
        if (valor >= 4.5) return '#10B981';
        if (valor >= 3.5) return '#3B82F6';
        if (valor >= 2.5) return '#F59E0B';
        if (valor >= 1.5) return '#F97316';
        return '#EF4444';
    }
}