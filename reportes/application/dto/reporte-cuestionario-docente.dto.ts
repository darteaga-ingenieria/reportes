export interface ReporteCuestionarioDocenteDto {
    // Datos del cuestionario
    cuestionarioId: number;
    cuestionarioNombre: string;
    anio: number;
    unidad: string;
    periodoId: number;
    periodoNombre: string;
    evaluacion_id: number;

    // Datos del docente
    docenteId: number;
    docenteNombre: string;
    docenteApellido: string;

    // Datos del curso
    cursoId: number;
    cursoNombre: string;

    // Datos de la sección
    seccionId: number;
    seccionNombre: string;

    // Datos del destino
    destinoTipo: string;
    destinoId: number;
    destinoNombre: string;
    
    // Totales
    totalInvitaciones: number;
    
    // Tabulaciones
    escala: TabulacionPreguntaDto[];
    opcion: TabulacionPreguntaDto[];
    abiertas: PreguntaTextoDto[];
}

export interface TabulacionPreguntaDto {
    preguntaId: number;
    orden: number;
    preguntaTexto: string;
    promedio: number;
    total: number;
    opciones: TabulacionOpcionesDto[];
}

export interface TabulacionOpcionesDto {
    respuestaOpcionId?: number;
    respuestaOpcionDescripcion: string;
    respuestaOpcionValor: number;
    cantidad: number;
}

export interface PreguntaTextoDto {
    preguntaId: number;
    orden: number;
    preguntaTexto: string;
    total: number;
    comentarios: ComentarioDto[];
}

export interface ComentarioDto {
    invitacionId: number;
    respuestaId: number;
    comentario: string;
}