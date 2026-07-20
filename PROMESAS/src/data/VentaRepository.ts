import { readFile, writeFile } from "fs/promises";
import { Venta } from "../models/Venta";

export class VentaRepository {
    private ruta = "./src/data/ventas.json";

    async obtenerVentas(): Promise<Venta[]> {
        try {
            const datos = await readFile(this.ruta, "utf-8");
            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarVentas(ventas: Venta[]): Promise<void> {
        try {
            await writeFile(this.ruta, JSON.stringify(ventas, null, 4));
        } catch (error) {
            console.log("Error al guardar.");
            throw error;
        }
    }
}