import {readFile, writeFile} from "fs/promises";
import { Usuario } from "../models/Usuario";

export class UsuarioRepository {
    
    //Dar la ruta donde se almacena mi archivo JSON
    private ruta = "./src/data/usuarios.json";

    //Metodo para obtenerUsuarios | mostrar los datos
    async obtenerUsuario(): Promise<Usuario[]> {

        try {
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    // Metodo para guardarUsuarios | para actualizar
    async guardarUsuarios(usuarios : Usuario[]): Promise<void> {
        try {
            
            await writeFile(
                this.ruta,
                JSON.stringify(usuarios, null, 4)
            );
        } catch (error) {
            console.log("Error al guardar.");
            throw error; 
        }
    } 
}