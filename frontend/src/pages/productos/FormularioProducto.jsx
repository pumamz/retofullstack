import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductoService } from '../../services/productoService';

const FormularioProducto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [producto, setProducto] = useState({
        name: '',
        description: '',
        priceBuy: '',
        priceSale: '',
        stock: ''
    });

    const cargarProducto = useCallback(async () => {
        try {
            const response = await ProductoService.obtenerProducto(id);
            setProducto(response.data);
        } catch (error) {
            console.error('Error al cargar producto:', error);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            cargarProducto();
        }
    }, [id, cargarProducto]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ProductoService.guardarProducto(producto);
            navigate('/productos');
        } catch (error) {
            console.error('Error al guardar producto:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={producto.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={producto.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio de Compra</label>
                    <input
                        type="number"
                        className="form-control"
                        name="priceBuy"
                        value={producto.priceBuy}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio de Venta</label>
                    <input
                        type="number"
                        className="form-control"
                        name="priceSale"
                        value={producto.priceSale}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={producto.stock}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Guardar
                </button>
                <button 
                    type="button" 
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate('/productos')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default FormularioProducto;