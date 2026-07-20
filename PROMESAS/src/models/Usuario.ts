import { Estado } from "./Estado";
import { Rol } from "./Rol";

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    edad: number;
    correo: string;
    contrasena: string;
    rol: Rol;
    estado: Estado;
}