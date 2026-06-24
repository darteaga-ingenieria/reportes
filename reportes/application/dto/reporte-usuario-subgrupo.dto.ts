export interface ReporteUsuarioSubgrupoDto {
    periodo: string;
    subgrupo: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    totalEvaluadores: number;
    evaluadores: {
        numero: number;
        nombre: string;
        apellido: string;
    }[];
}