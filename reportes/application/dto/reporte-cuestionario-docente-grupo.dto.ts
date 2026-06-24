export interface ReporteCuestionarioGrupoDto {
    cuestionarioId: number;
    cuestionarioNombre: string;
    anio: number;
    unidad: string;
    periodoId: number;
    periodoNombre: string;
    evaluacion_id: number;
    docentes: DocenteReporteDto[];
    ranking: RankingItemDto[];
    preguntas: PreguntaInstrumentoDto[];
    totalDocentes: number;
    totalInvitaciones: number;
}

export interface DocenteReporteDto {
    docenteId: number;
    docenteNombre: string;
    docenteApellido: string;
    cursoId: number;
    cursoNombre: string;
    seccionId: number;
    seccionNombre: string;
    puntajeTotal: number;
    puntajePorPregunta: PuntajePreguntaDto[];
    respuestasEscala: RespuestaEscalaDto[];
    comentarios: ComentarioDto[];
    totalInvitaciones: number;
}

export interface PuntajePreguntaDto {
    preguntaId: number;
    preguntaTexto: string;
    orden: number;
    promedio: number;
    total: number;
}

export interface RespuestaEscalaDto {
    invitacionId: number;
    preguntaId: number;
    preguntaTexto: string;
    valor: number;
    descripcion: string;
}

export interface RankingItemDto {
    posicion: number;
    docenteId: number;
    nombre: string;
    curso: string;
    seccion: string;
    puntaje: number;
}

export interface PreguntaInstrumentoDto {
    preguntaId: number;
    orden: number;
    preguntaTexto: string;
    tipoPreguntaId: number;
    tipoPreguntaNombre: string;
}

export interface ComentarioDto {
    invitacionId: number;
    comentario: string;
}