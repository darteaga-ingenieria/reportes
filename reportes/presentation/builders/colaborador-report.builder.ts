
import fs from 'fs';
import path from 'path';
import { IPdfBuilder } from '../../domain/pdf.builder.interface.js';
import { TDocumentDefinitions } from 'pdfmake/interfaces.js';

const BLUE = '#2563EB';
const HEADER_BG = '#800000';
const BORDER_GRAY = '#D1D5DB';

export class ColaboradorReportBuilder implements IPdfBuilder<{colaboradores: any[] }>{

  public build(
    {colaboradores}: {colaboradores: any[]}
  ): any { 
    // traes la imagen por la ruta
    const logoPath = path.resolve( 
      process.cwd(),
      'src/shared/pdf/assets/logo-colegio.png'
    )
    // conviertes la imagen a base 64 para poder ser usada
    const logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
    // fecha que se genera el reporte
    const fecha = new Date().toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return {
      // tamano y margenes de la pagina
      pageSize: 'A4',
      pageMargins: [30, 60, 30, 50],
      // configuracionde cabecera
      header: {
        margin: [30, 20, 30, 0],
        columns: [
          logoBase64 ? { image: logoBase64, width: 120 }
            : { text: '' },
          {
            stack: [
              {
                text: 'SISTEMA DE ENCUESTAS',
                style: 'headerTitle',
                
              },
            ],
            alignment: 'right'
          },
        ]
      },
// configuracion de pie de pagina
      footer: ( currentPage: number, pageCount: number ) => {
        return {
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
        };
      },
      // contenido general titulo y subtitulos
      content: [
        {
          text: 'REPORTE DE COLABORADORES',
          style: 'title'
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              text: `Fecha de generación: ${fecha}`,
              style: 'info'
            },
            {
              text: `Total colaboradores: ${colaboradores.length}`,
              alignment: 'right',
              style: 'info'
            }
          ]
        },

        // configuracion de tabla
        {
          margin: [0, 10, 0, 0],
          table: {
            headerRows: 1,
            dontBreakRows: true, //ninguna fila se divide al fin de cada pagina
            //tamaño de cada columna 
            widths: [
              55,
              '*',
              '*',
              40,
              '*'
            ],
            // encabezado de tabla
            body: [
              [
                {
                  text: 'ID',
                  style: 'tableHeader'
                },
                {
                  text: 'NOMBRE',
                  style: 'tableHeader'
                },
                {
                  text: 'APELLIDO',
                  style: 'tableHeader'
                },
                {
                  text: 'TIPO',
                  style: 'tableHeader'
                },
                {
                  text: 'UNIDAD',
                  style: 'tableHeader'
                }
              ],
              // genera fila dinamicamente
              ...colaboradores.map(
                (c) => [
                  {
                    text: String(c.id_externo ?? ''),
                    alignment: 'center'
                  },
                  {
                    text: c.nombre ?? ''
                  },
                  {
                    text: c.apellido ?? ''
                  },
                  {
                    text: c.tipo_usuario ?? '',
                    alignment: 'center'
                  },
                  {
                    text: c.unidad ?? ''
                  }
                ]
              )
            ]
          },
          layout: {
            //controla el color de cada fila
            fillColor: (
              rowIndex: number
            ) => {
              // encabezado de un color
              if (rowIndex === 0) {
                return HEADER_BG;
              }
              // filas alternadas
              return rowIndex % 2 === 0
                ? '#F9FAFB'
                : null;
            },
            hLineColor: () => BORDER_GRAY, // lineas horizontales
            vLineColor: () => BORDER_GRAY, //  lineas verticales
            hLineWidth: () => 0.5, // grosor horizontal
            vLineWidth: () => 0.5,  // grosor vertical
            paddingLeft: () => 8, // espacio del texto dentro de cada celda
            paddingRight: () => 8,
            paddingTop: () => 2,
            paddingBottom: () => 2,
          }
        }
      ],

      // estilos que se reutilizan
      styles: {
        headerTitle: {
          fontSize: 12,
          bold: true,
          color: '#800000'
        },
        headerSubtitle: {
          fontSize: 10,
          color: '#4B5563'
        },
        title: {
          fontSize: 18,
          decoration: 'underline',
          bold: true,
          color: '#000000',
          alignment: 'center',
          margin: [0, 0, 0, 10],
          characterSpacing: 1
        },
        info: {
          fontSize: 10,
          color: '#374151'
        },
        tableHeader: {
          bold: true,
          color: '#FFFFFF',
          alignment: 'center',
          fontSize: 10
        }
      },
      // el texto que no tiene un estilo usara este por default
      defaultStyle: {
        fontSize: 9
      }
    };
  }
}

