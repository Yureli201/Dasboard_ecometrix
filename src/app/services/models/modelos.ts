export interface Usuario {
    id_usuario: number;
    nombre_empresa: string;
    gmail: string;
    estado: string;
    sector: string;
    actividad_principal: string;
    num_empleados: number;
}
export interface Login{
    gmail: string;
    password: string;
}