// presentation/builders/styles/pdf.styles.ts
import { StyleDictionary } from 'pdfmake/interfaces.js';

export const PdfStyles: StyleDictionary = {
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
} as StyleDictionary;  // ✅ Forzar el tipo