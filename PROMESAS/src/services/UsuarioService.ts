import { UsuarioRepository } from "../data/UsuarioRepository";
import { Usuario } from "../models/Usuario";
import { Rol } from "../models/Rol";

export class UsuarioService {
    private repository = new UsuarioRepository();

    // Metodo para listar usuarios
    async listar(): Promise<Usuario[]> {
        return await this.repository.obtenerUsuario();
    }

    // Metodo para registrar usuarios
    async registrar(usuario: Usuario): Promise<void> {
        try {
            const usuarios = await this.repository.obtenerUsuario();

            const existeCorreo = usuarios.some(u => u.correo === usuario.correo);

            if (existeCorreo) {
                console.log("YA EXISTE UN USUARIO CON ESE CORREO");
                return;
            }

            // Validar correo
            if (!this.validarCorreo(usuario.correo)) {
                console.log("CORREO NO VÁLIDO. SOLO @gmail.com, @hotmail.com, @outlook.com");
                return;
            }

            // Solo ADMIN puede crear otro ADMIN
            if (usuario.rol !== Rol.ADMIN) {
                usuario.rol = Rol.USUARIO;
            }

            usuarios.push(usuario);
            await this.repository.guardarUsuarios(usuarios);
            console.log("USUARIO REGISTRADO CORRECTAMENTE");
        } catch (error) {
            console.log("ERROR AL REGISTRAR USUARIO");
            throw error;
        }
    }

    // Metodo para login
    async login(correo: string, contrasena: string): Promise<Usuario | null> {
        const usuarios = await this.repository.obtenerUsuario();
        const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

        if (usuario && usuario.estado === "ACTIVO") {
            return usuario;
        }
        return null;
    }

    // Metodo para validar correo
    validarCorreo(correo: string): boolean {
        const dominios = ["@gmail.com", "@hotmail.com", "@outlook.com"];
        return dominios.some(dominio => correo.includes(dominio));
    }

    // Metodo para buscar
    async buscar(id: number): Promise<Usuario | undefined> {
        const usuarios = await this.repository.obtenerUsuario();
        return usuarios.find(u => u.id === id);
    }

    // Metodo para actualizar
    async actualizar(usuario: Usuario): Promise<void> {
        try {
            const usuarios = await this.repository.obtenerUsuario();
            const indice = usuarios.findIndex(u => u.id === usuario.id);

            if (indice === -1) {
                console.log("USUARIO NO EXISTE");
                return;
            }
            usuarios[indice] = usuario;
            await this.repository.guardarUsuarios(usuarios);
            console.log("USUARIO ACTUALIZADO CORRECTAMENTE");
        } catch (error) {
            console.log("ERROR AL ACTUALIZAR UN USUARIO");
            throw error;
        }
    }

    // Metodo para eliminar
    async eliminar(id: number): Promise<void> {
        try {
            const usuarios = await this.repository.obtenerUsuario();
            const nuevos = usuarios.filter(u => u.id !== id);

            if (nuevos.length === usuarios.length) {
                console.log("USUARIO NO ENCONTRADO");
                return;
            }

            await this.repository.guardarUsuarios(nuevos);
            console.log("USUARIO ELIMINADO CORRECTAMENTE");
        } catch (error) {
            console.log("ERROR AL ELIMINAR UN USUARIO");
            throw error;
        }
    }
}