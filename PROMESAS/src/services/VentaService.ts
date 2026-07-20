import { VentaRepository } from "../data/VentaRepository";
import { ProductoRepository } from "../data/ProductoRepository";
import { Venta } from "../models/Venta";

export class VentaService {
    private repository = new VentaRepository();
    private productoRepository = new ProductoRepository();

    // Metodo para listar ventas
    async listar(): Promise<Venta[]> {
        return await this.repository.obtenerVentas();
    }

    // Metodo para realizar venta
    async realizarVenta(venta: Venta): Promise<void> {
        try {
            const productos = await this.productoRepository.obtenerProductos();
            const ventas = await this.repository.obtenerVentas();

            // Verificar stock
            for (const item of venta.productos) {
                const producto = productos.find(p => p.id === item.id);
                if (!producto) {
                    console.log(`PRODUCTO ${item.id} NO EXISTE`);
                    return;
                }
                if (producto.stock < item.stock) {
                    console.log(`STOCK INSUFICIENTE PARA ${producto.nombre}`);
                    return;
                }
            }

            // Actualizar stock
            for (const item of venta.productos) {
                const producto = productos.find(p => p.id === item.id);
                if (producto) {
                    producto.stock -= item.stock;
                }
            }

            // Calcular total
            venta.total = venta.productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
            venta.fecha = new Date().toISOString();

            // Guardar venta
            ventas.push(venta);
            await this.repository.guardarVentas(ventas);
            await this.productoRepository.guardarProductos(productos);

            console.log("VENTA REALIZADA CORRECTAMENTE");
            console.log(`TOTAL: $${venta.total}`);
        } catch (error) {
            console.log("ERROR AL REALIZAR VENTA");
            throw error;
        }
    }

    // Metodo para buscar venta
    async buscar(id: number): Promise<Venta | undefined> {
        const ventas = await this.repository.obtenerVentas();
        return ventas.find(v => v.id === id);
    }
}