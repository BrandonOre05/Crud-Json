import { ProductoRepository } from "../data/ProductoRepository";
import { Producto } from "../models/Producto";

export class ProductoService {
    private repository = new ProductoRepository();

    // Metodo para listar productos
    async listar(): Promise<Producto[]> {
        return await this.repository.obtenerProductos();
    }

    // Metodo para agregar producto
    async agregar(producto: Producto): Promise<void> {
        try {
            const productos = await this.repository.obtenerProductos();

            const existe = productos.some(p => p.id === producto.id);

            if (existe) {
                console.log("YA EXISTE UN PRODUCTO CON ESE ID");
                return;
            }

            productos.push(producto);
            await this.repository.guardarProductos(productos);
            console.log("PRODUCTO AGREGADO CORRECTAMENTE");
        } catch (error) {
            console.log("ERROR AL AGREGAR PRODUCTO");
            throw error;
        }
    }

    // Metodo para buscar
    async buscar(id: number): Promise<Producto | undefined> {
        const productos = await this.repository.obtenerProductos();
        return productos.find(p => p.id === id);
    }

    // Metodo para actualizar
    async actualizar(producto: Producto): Promise<void> {
        try {
            const productos = await this.repository.obtenerProductos();
            const indice = productos.findIndex(p => p.id === producto.id);

            if (indice === -1) {
                console.log("PRODUCTO NO EXISTE");
                return;
            }
            productos[indice] = producto;
            await this.repository.guardarProductos(productos);
            console.log("PRODUCTO ACTUALIZADO CORRECTAMENTE");
        } catch (error) {
            console.log("ERROR AL ACTUALIZAR PRODUCTO");
            throw error;
        }
    }

    // Metodo para eliminar
    async eliminar(id: number): Promise<void> {
        try {
            const productos = await this.repository.obtenerProductos();
            const nuevos = productos.filter(p => p.id !== id);

            if (nuevos.length === productos.length) {
                console.log("PRODUCTO NO ENCONTRADO");
                return;
            }

            await this.repository.guardarProductos(nuevos);
            console.log("PRODUCTO ELIMINADO CORRECTAMENTE");
        } catch (error) {
            console.log("ERROR AL ELIMINAR PRODUCTO");
            throw error;
        }
    }
}