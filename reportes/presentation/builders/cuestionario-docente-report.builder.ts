import { TDocumentDefinitions } from 'pdfmake/interfaces.js';
import { IPdfBuilder } from '../../domain/pdf.builder.interface.js';
import { ReporteCuestionarioDocenteDto } from '../../application/dto/reporte-cuestionario-docente.dto.js';
import { HeaderSection } from './sections/header.section.js';
import { FooterSection } from './sections/footer.section.js';
import { PortadaSection } from './sections/portada.section.js';
import { InformacionGeneralSection } from './sections/informacion-general.section.js';
import { TabulacionSection } from './sections/tabulacion.section.js';
import { PdfStyles } from './styles/pdf.styles.js';

export class CuestionarioDocenteReportBuilder implements IPdfBuilder<ReporteCuestionarioDocenteDto> {
    build(data: ReporteCuestionarioDocenteDto): TDocumentDefinitions {
        return {
            content: [
                ...PortadaSection.build(data),
                ...InformacionGeneralSection.build(data),
                ...TabulacionSection.build(data),
            ],
            styles: PdfStyles,
            header: (currentPage, pageCount) => HeaderSection.build(currentPage, pageCount),
            footer: (currentPage, pageCount) => FooterSection.build(currentPage, pageCount),
            defaultStyle: { font: 'Roboto', fontSize: 10 },
            pageMargins: [40, 80, 40, 40],
            pageSize: 'A4',
        };
    }
}