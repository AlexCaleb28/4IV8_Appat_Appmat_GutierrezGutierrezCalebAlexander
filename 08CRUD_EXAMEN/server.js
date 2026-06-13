const express = require('express');
const cors = require('cors');
const pool = require('./conexion.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const TARIFA_POR_HORA = 50; 

// LÍMITES ESTABLECIDOS EN EL SERVIDOR

const LIMITE_STOCK = 1000;
const LIMITE_PRECIO = 10000;

// 1. MESAS Y TIEMPO

app.get('/api/mesas', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM mesas");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener mesas" });
    }
});

app.post('/api/rentar', async (req, res) => {
    try {
        const { id_mesa } = req.body;
        const horaInicio = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
        
        await pool.query("INSERT INTO rentas (id_mesa, hora_inicio) VALUES (?, ?)", [id_mesa, horaInicio]);
        await pool.query("UPDATE mesas SET estado = 'Ocupada' WHERE id = ?", [id_mesa]);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al rentar la mesa" });
    }
});

app.get('/api/rentas-activas', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM rentas WHERE hora_fin IS NULL");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener rentas activas" });
    }
});

app.post('/api/cobrar', async (req, res) => {
    try {
        const { id_renta } = req.body;
        const horaFin = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
        const totalCobro = TARIFA_POR_HORA; 

        const [renta] = await pool.query("SELECT id_mesa FROM rentas WHERE id_renta = ?", [id_renta]);
        if (renta.length === 0) return res.status(404).json({ error: "Renta no encontrada" });
        
        await pool.query("UPDATE rentas SET hora_fin = ?, total = ? WHERE id_renta = ?", [horaFin, totalCobro, id_renta]);
        await pool.query("UPDATE mesas SET estado = 'Disponible' WHERE id = ?", [renta[0].id_mesa]);
        
        res.json({ success: true, total: totalCobro });
    } catch (error) {
        res.status(500).json({ error: "Error al cobrar la renta" });
    }
});

// 2. CATÁLOGO DE ACCESORIOS

app.get('/api/productos', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el catálogo" });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, stock, precio } = req.body;
        
        // CERO BLOQUEADO (<= 0)
        if (!nombre || nombre.length < 2) return res.status(400).json({ error: "Nombre inválido" });
        if (isNaN(stock) || stock <= 0 || stock > LIMITE_STOCK) return res.status(400).json({ error: `El stock debe ser mayor a 0 y máximo ${LIMITE_STOCK}` });
        if (isNaN(precio) || precio <= 0 || precio > LIMITE_PRECIO) return res.status(400).json({ error: `El precio debe ser mayor a $0 y máximo $${LIMITE_PRECIO}` });

        await pool.query("INSERT INTO productos (nombre, stock, precio) VALUES (?, ?, ?)", [nombre, stock, precio]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar artículo" });
    }
});

app.put('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, stock, precio } = req.body;

        // CERO BLOQUEADO (<= 0)

        if (!nombre || nombre.length < 2) return res.status(400).json({ error: "Nombre inválido" });
        if (isNaN(stock) || stock <= 0 || stock > LIMITE_STOCK) return res.status(400).json({ error: `El stock debe ser mayor a 0 y máximo ${LIMITE_STOCK}` });
        if (isNaN(precio) || precio <= 0 || precio > LIMITE_PRECIO) return res.status(400).json({ error: `El precio debe ser mayor a $0 y máximo $${LIMITE_PRECIO}` });

        await pool.query(
            "UPDATE productos SET nombre = ?, stock = ?, precio = ? WHERE id = ?", 
            [nombre, stock, precio, id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al editar el artículo" });
    }
});

app.post('/api/productos/stock', async (req, res) => {
    try {
        const { id, nuevoStock } = req.body;
        
        // CERO BLOQUEADO (<= 0)
        if (isNaN(nuevoStock) || nuevoStock <= 0 || nuevoStock > LIMITE_STOCK) {
            return res.status(400).json({ error: `El stock debe ser mayor a 0 y máximo ${LIMITE_STOCK}` });
        }

        await pool.query("UPDATE productos SET stock = ? WHERE id = ?", [nuevoStock, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar stock" });
    }
});

app.post('/api/productos/vender', async (req, res) => {
    try {
        const { id, cantidad } = req.body;
        
        if (isNaN(cantidad) || cantidad <= 0) return res.status(400).json({ error: "Cantidad inválida" });

        const [prod] = await pool.query("SELECT stock, precio FROM productos WHERE id = ?", [id]);
        
        if (prod.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });
        if (prod[0].stock < cantidad) return res.status(400).json({ error: "No hay suficiente stock en vitrina" });

        const totalRenta = prod[0].precio * cantidad;

        await pool.query("UPDATE productos SET stock = stock - ? WHERE id = ?", [cantidad, id]);
        await pool.query("INSERT INTO ventas (id_producto, cantidad, total) VALUES (?, ?, ?)", [id, cantidad, totalRenta]);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la renta del artículo" });
    }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM ventas WHERE id_producto = ?", [req.params.id]);
        await pool.query("DELETE FROM productos WHERE id = ?", [req.params.id]);
        res.status(200).json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar el artículo' });
    }
});

// 3. REGISTRO DE RENTAS Y DEVOLUCIONES

app.get('/api/ventas', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT v.*, p.nombre FROM ventas v JOIN productos p ON v.id_producto = p.id ORDER BY v.fecha DESC LIMIT 10"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener registro de equipo rentado" });
    }
});

app.post('/api/ventas/cobrar', async (req, res) => {
    try {
        const { id_venta } = req.body;

        const [venta] = await pool.query("SELECT id_producto, cantidad FROM ventas WHERE id = ?", [id_venta]);
        
        if (venta.length === 0) return res.status(404).json({ error: "Registro no encontrado" });

        const { id_producto, cantidad } = venta[0];

        await pool.query("UPDATE productos SET stock = stock + ? WHERE id = ?", [cantidad, id_producto]);
        await pool.query("DELETE FROM ventas WHERE id = ?", [id_venta]);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar la devolución del equipo" });
    }
});

app.listen(3000, () => {
    console.log("Servidor de Billar corriendo en http://localhost:3000");
});