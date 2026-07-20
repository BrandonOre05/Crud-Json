import { Producto } from "./Producto";

export interface Venta {
    id: number;
    usuarioId: number;
    productos: Producto[];
    total: number;
    fecha: string;
}