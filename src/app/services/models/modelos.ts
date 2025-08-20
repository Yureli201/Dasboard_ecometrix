export interface Usuario {
    id_usuario: number;
    nombre_empresa: string;
    gmail: string;
    estado: string;
    sector: string;
    actividad_principal: string;
    num_empleados: number;
}

export interface TipoFuente {
    id: number;
    nombre: string;
    unidad: string;
    total_cantidad?: number;
    total_costo?: number;
}