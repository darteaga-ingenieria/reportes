import { Content } from 'pdfmake/interfaces.js';
import { ReporteCuestionarioDocenteDto } from '../../../application/dto/reporte-cuestionario-docente.dto.js';

export class TabulacionSection {
    static build(data: ReporteCuestionarioDocenteDto): Content[] {
        const content: Content[] = [];

        // Escala
        if (data.escala?.length > 0) {
            content.push(
                { text: '📊 PREGUNTAS DE ESCALA', style: 'subtitle', margin: [0, 20, 0, 10] },
                this.buildTablaEscala(data.escala)
            );
        }

        // Opción
        if (data.opcion?.length > 0) {
            content.push(
                { text: '📋 PREGUNTAS DE OPCIÓN', style: 'subtitle', margin: [0, 20, 0, 10] },
                this.buildTablaOpcion(data.opcion)
            );
        }

        // Abiertas
        if (data.abiertas?.length > 0) {
            content.push(
                { text: '💬 PREGUNTAS ABIERTAS', style: 'subtitle', margin: [0, 20, 0, 10] },
                this.buildTablaAbiertas(data.abiertas)
            );
        }

        return content;
    }

    private static buildTablaEscala(preguntas: any[]): Content {
        const body: any[] = [
            [{ text: 'N°', style: 'tableHeader' }, { text: 'Pregunta', style: 'tableHeader' }, { text: 'Promedio', style: 'tableHeader', alignment: 'center' }, { text: 'Total', style: 'tableHeader', alignment: 'center' }]
        ];

        preguntas.forEach(p => {
            body.push([
                p.orden.toString(),
                p.preguntaTexto,
                { text: p.promedio.toFixed(2), alignment: 'center', bold: true, color: this.getColor(p.promedio) },
                { text: p.total.toString(), alignment: 'center' }
            ]);
        });

        return { table: { headerRows: 1, widths: [40, '*', 70, 70], body }, layout: this.getLayout() };
    }

    private static buildTablaOpcion(preguntas: any[]): Content {
        const body: any[] = [
            [{ text: 'N°', style: 'tableHeader' }, { text: 'Pregunta', style: 'tableHeader' }, { text: 'Opción', style: 'tableHeader' }, { text: 'Cantidad', style: 'tableHeader', alignment: 'center' }]
        ];

        preguntas.forEach(p => {
            const opciones = p.opciones || [];
            if (opciones.length === 0) {
                body.push([p.orden.toString(), p.preguntaTexto, 'Sin respuestas', '0']);
            } else {
                opciones.forEach((op: any, i: number) => {
                    body.push([
                        i === 0 ? p.orden.toString() : '',
                        i === 0 ? p.preguntaTexto : '',
                        op.respuestaOpcionDescripcion || 'Sin descripción',
                        { text: op.cantidad.toString(), alignment: 'center' }
                    ]);
                });
            }
        });

        return { table: { headerRows: 1, widths: [40, '*', '*', 60], body }, layout: this.getLayout() };
    }

    private static buildTablaAbiertas(preguntas: any[]): Content {
        const body: any[] = [
            [{ text: 'N°', style: 'tableHeader' }, { text: 'Pregunta', style: 'tableHeader' }, { text: 'Total', style: 'tableHeader', alignment: 'center' }]
        ];

        preguntas.forEach(p => {
            body.push([p.orden.toString(), p.preguntaTexto, { text: p.total.toString(), alignment: 'center' }]);
            
            (p.comentarios || []).forEach((c: any) => {
                body.push(['', { text: `  • ${c.comentario}`, italics: true, fontSize: 9 }, '']);
            });
        });

        return { table: { headerRows: 1, widths: [40, '*', 60], body }, layout: this.getLayout() };
    }

    private static getLayout() {
        return {
            fillColor: (rowIndex: number) => {
                if (rowIndex === 0) return '#800000';
                return rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
            },
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#D1D5DB',
            vLineColor: () => '#D1D5DB'
        };
    }

    private static getColor(promedio: number): string {
        if (promedio >= 4.5) return '#10B981';
        if (promedio >= 3.5) return '#3B82F6';
        if (promedio >= 2.5) return '#F59E0B';
        if (promedio >= 1.5) return '#F97316';
        return '#EF4444';
    }
}