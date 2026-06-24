import { TDocumentDefinitions } from "pdfmake/interfaces.js";
export interface IPdfBuilder <T>{
 build (data: T): any;
}