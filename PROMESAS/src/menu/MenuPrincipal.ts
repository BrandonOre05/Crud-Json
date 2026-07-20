import { Estado } from "../models/Estado";
import { Rol } from "../models/Rol";
import { UsuarioService } from "../services/UsuarioService";
import { ProductoService } from "../services/ProductoService";
import { VentaService } from "../services/VentaService";
import { rl } from "../utils/Readline";

const usuarioService = new UsuarioService();
const productoService = new ProductoService();
const ventaService = new VentaService();

let usuarioActual: any = null;

export async function menuPrincipal() {
    let opcion = 0;

    do {
        console.log("\n=== SISTEMA DE GESTIÓN ===");
        console.log("1. INICIAR SESIÓN");
        console.log("2. REGISTRARSE");
        console.log("3. SALIR");

        opcion = Number(await rl.question("OPCIÓN: "));

        switch (opcion) {
            case 1:
                await iniciarSesion();
                break;
            case 2:
                await registrarUsuario();
                break;
            case 3:
                console.log("¡HASTA LUEGO!");
                rl.close();
                return;
            default:
                console.log("OPCIÓN NO VÁLIDA");
        }
    } while (opcion !== 3);
}

async function iniciarSesion() {
    console.log("\n=== INICIAR SESIÓN ===");
    const correo = await rl.question("CORREO: ");
    const contrasena = await rl.question("CONTRASENA: ");

    const usuario = await usuarioService.login(correo, contrasena);

    if (usuario) {
        usuarioActual = usuario;
        console.log(`BIENVENIDO ${usuario.nombre} (${usuario.rol})`);
        await menuOpciones();
    } else {
        console.log("CREDENCIALES INCORRECTAS O USUARIO INACTIVO");
    }
}

async function registrarUsuario() {
    console.log("\n=== REGISTRAR USUARIO ===");
    const id = Number(await rl.question("ID: "));
    const nombre = await rl.question("NOMBRE: ");
    const apellido = await rl.question("APELLIDO: ");
    const edad = Number(await rl.question("EDAD: "));
    const correo = await rl.question("CORREO: ");
    const contrasena = await rl.question("CONTRASENA: ");

    let rol = Rol.USUARIO;
    // Solo ADMIN puede crear otro ADMIN
    if (usuarioActual && usuarioActual.rol === Rol.ADMIN) {
        const esAdmin = await rl.question("¿ES ADMIN? (s/n): ");
        if (esAdmin.toLowerCase() === 's') {
            rol = Rol.ADMIN;
        }
    }

    await usuarioService.registrar({
        id,
        nombre,
        apellido,
        edad,
        correo,
        contrasena,
        rol,
        estado: "ACTIVO"
    });
}

async function menuOpciones() {
    let opcion = 0;

    do {
        console.log("\n=== MENÚ PRINCIPAL ===");
        console.log("1. GESTIONAR USUARIOS");
        console.log("2. GESTIONAR PRODUCTOS");
        console.log("3. REALIZAR VENTA");
        console.log("4. VER VENTAS");
        console.log("5. CERRAR SESIÓN");

        opcion = Number(await rl.question("OPCIÓN: "));

        switch (opcion) {
            case 1:
                if (usuarioActual.rol === Rol.ADMIN) {
                    await menuUsuarios();
                } else {
                    console.log("ACCESO DENEGADO. SOLO ADMIN");
                }
                break;
            case 2:
                if (usuarioActual.rol === Rol.ADMIN) {
                    await menuProductos();
                } else {
                    console.log("ACCESO DENEGADO. SOLO ADMIN");
                }
                break;
            case 3:
                await realizarVenta();
                break;
            case 4:
                await verVentas();
                break;
            case 5:
                console.log("SESIÓN CERRADA");
                usuarioActual = null;
                return;
            default:
                console.log("OPCIÓN NO VÁLIDA");
        }
    } while (opcion !== 5);
}

async function menuUsuarios() {
    let opcion = 0;

    do {
        console.log("\n=== GESTIONAR USUARIOS ===");
        console.log("1. LISTAR USUARIOS");
        console.log("2. BUSCAR USUARIO");
        console.log("3. ACTUALIZAR USUARIO");
        console.log("4. ELIMINAR USUARIO");
        console.log("5. VOLVER");

        opcion = Number(await rl.question("OPCIÓN: "));

        switch (opcion) {
            case 1:
                console.table(await usuarioService.listar());
                break;
            case 2:
                const idBuscar = Number(await rl.question("ID: "));
                const usuario = await usuarioService.buscar(idBuscar);
                if (usuario) {
                    console.table([usuario]);
                } else {
                    console.log("USUARIO NO ENCONTRADO");
                }
                break;
            case 3:
                const idAct = Number(await rl.question("ID DEL USUARIO A ACTUALIZAR: "));
                const usuarioAct = await usuarioService.buscar(idAct);
                if (!usuarioAct) {
                    console.log("USUARIO NO ENCONTRADO");
                    break;
                }
                console.log("DEJA EN BLANCO PARA MANTENER EL VALOR ACTUAL");
                const nombre = await rl.question(`NOMBRE (${usuarioAct.nombre}): `) || usuarioAct.nombre;
                const apellido = await rl.question(`APELLIDO (${usuarioAct.apellido}): `) || usuarioAct.apellido;
                const edad = Number(await rl.question(`EDAD (${usuarioAct.edad}): `) || usuarioAct.edad);
                const correo = await rl.question(`CORREO (${usuarioAct.correo}): `) || usuarioAct.correo;
                const contrasena = await rl.question(`CONTRASENA: `) || usuarioAct.contrasena;
                const estadoTexto = await rl.question(`ESTADO (${usuarioAct.estado}): `) || usuarioAct.estado;

                await usuarioService.actualizar({
                    id: usuarioAct.id,
                    nombre,
                    apellido,
                    edad,
                    correo,
                    contrasena,
                    rol: usuarioAct.rol,
                    estado: estadoTexto.toUpperCase() as Estado
                });
                break;
            case 4:
                const idElim = Number(await rl.question("ID A ELIMINAR: "));
                await usuarioService.eliminar(idElim);
                break;
            case 5:
                return;
            default:
                console.log("OPCIÓN NO VÁLIDA");
        }
    } while (opcion !== 5);
}

async function menuProductos() {
    let opcion = 0;

    do {
        console.log("\n=== GESTIONAR PRODUCTOS ===");
        console.log("1. LISTAR PRODUCTOS");
        console.log("2. AGREGAR PRODUCTO");
        console.log("3. BUSCAR PRODUCTO");
        console.log("4. ACTUALIZAR PRODUCTO");
        console.log("5. ELIMINAR PRODUCTO");
        console.log("6. VOLVER");

        opcion = Number(await rl.question("OPCIÓN: "));

        switch (opcion) {
            case 1:
                console.table(await productoService.listar());
                break;
            case 2:
                const id = Number(await rl.question("ID: "));
                const nombre = await rl.question("NOMBRE: ");
                const descripcion = await rl.question("DESCRIPCIÓN: ");
                const precio = Number(await rl.question("PRECIO: "));
                const stock = Number(await rl.question("STOCK: "));
                const categoria = await rl.question("CATEGORÍA: ");

                await productoService.agregar({
                    id,
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    categoria
                });
                break;
            case 3:
                const idBuscar = Number(await rl.question("ID: "));
                const producto = await productoService.buscar(idBuscar);
                if (producto) {
                    console.table([producto]);
                } else {
                    console.log("PRODUCTO NO ENCONTRADO");
                }
                break;
            case 4:
                const idAct = Number(await rl.question("ID DEL PRODUCTO A ACTUALIZAR: "));
                const productoAct = await productoService.buscar(idAct);
                if (!productoAct) {
                    console.log("PRODUCTO NO ENCONTRADO");
                    break;
                }
                console.log("DEJA EN BLANCO PARA MANTENER EL VALOR ACTUAL");
                const nombreAct = await rl.question(`NOMBRE (${productoAct.nombre}): `) || productoAct.nombre;
                const descAct = await rl.question(`DESCRIPCIÓN (${productoAct.descripcion}): `) || productoAct.descripcion;
                const precioAct = Number(await rl.question(`PRECIO (${productoAct.precio}): `) || productoAct.precio);
                const stockAct = Number(await rl.question(`STOCK (${productoAct.stock}): `) || productoAct.stock);
                const catAct = await rl.question(`CATEGORÍA (${productoAct.categoria}): `) || productoAct.categoria;

                await productoService.actualizar({
                    id: productoAct.id,
                    nombre: nombreAct,
                    descripcion: descAct,
                    precio: precioAct,
                    stock: stockAct,
                    categoria: catAct
                });
                break;
            case 5:
                const idElim = Number(await rl.question("ID A ELIMINAR: "));
                await productoService.eliminar(idElim);
                break;
            case 6:
                return;
            default:
                console.log("OPCIÓN NO VÁLIDA");
        }
    } while (opcion !== 6);
}

async function realizarVenta() {
    console.log("\n=== REALIZAR VENTA ===");
    const productos = await productoService.listar();

    if (productos.length === 0) {
        console.log("NO HAY PRODUCTOS DISPONIBLES");
        return;
    }

    console.table(productos);

    const idVenta = Number(await rl.question("ID DE LA VENTA: "));
    const productosVenta: any[] = [];

    while (true) {
        const idProducto = Number(await rl.question("ID DEL PRODUCTO (0 PARA TERMINAR): "));
        if (idProducto === 0) break;

        const producto = await productoService.buscar(idProducto);
        if (!producto) {
            console.log("PRODUCTO NO ENCONTRADO");
            continue;
        }

        const cantidad = Number(await rl.question(`CANTIDAD (STOCK: ${producto.stock}): `));
        if (cantidad > producto.stock) {
            console.log("STOCK INSUFICIENTE");
            continue;
        }

        // Crear copia del producto con la cantidad comprada
        productosVenta.push({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: cantidad,
            categoria: producto.categoria
        });

        console.log(`PRODUCTO AGREGADO: ${producto.nombre} x${cantidad}`);
    }

    if (productosVenta.length === 0) {
        console.log("VENTA CANCELADA");
        return;
    }

    await ventaService.realizarVenta({
        id: idVenta,
        usuarioId: usuarioActual.id,
        productos: productosVenta,
        total: 0,
        fecha: ""
    });
}

async function verVentas() {
    console.log("\n=== LISTA DE VENTAS ===");
    const ventas = await ventaService.listar();

    if (ventas.length === 0) {
        console.log("NO HAY VENTAS REGISTRADAS");
        return;
    }

    console.table(ventas);
}