import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from "./components/layout/PrivateLayout";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/dashboard/Home";
import ListaProductos from "./pages/productos/ListaProductos";
import FormularioProducto from "./pages/productos/FormularioProducto";
import ListaVentas from "./pages/productos/ListaVentas";
import FormularioVenta from "./pages/productos/FormularioVenta";
import ListaPedidos from "./pages/productos/ListaPedidos";
import FormularioPedido from "./pages/productos/FormularioPedido";
import Profile from "./pages/dashboard/Profile";
import ListaMembresias from "./pages/membresias/ListaMembresias";
import FormularioMembresia from "./pages/membresias/FormularioMembresia";
import ListaVentasMembresias from "./pages/membresias/ListaVentasMembresias";
import FormularioVentaMembresia from "./pages/membresias/FormularioVentaMembresia";
import ListaClasesPersonalizadas from "./pages/membresias/ListaClasesPersonalizadas";
import FormularioClasePersonalizada from "./pages/membresias/FormularioClasePersonalizada";
import ListaClientes from "./pages/usuarios/ListaClientes";
import ListaProveedores from "./pages/usuarios/ListaProveedores";
import FormularioProveedores from "./pages/usuarios/FormularioProveedores";
import Reportes from "./pages/reportes/Reportes";
import FormularioClientes from "./pages/usuarios/FormularioClientes";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MainLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="user/perfil" element={<Profile />} />
                        <Route path="productos" element={<ListaProductos />} />
                        <Route path="productos/crear" element={<FormularioProducto />} />
                        <Route path="productos/editar/:id" element={<FormularioProducto />} />
                        <Route path="productos/ventas" element={<ListaVentas />} />
                        <Route path="productos/ventas/vender" element={<FormularioVenta />} />
                        <Route path="productos/pedidos" element={<ListaPedidos />} />
                        <Route path="productos/pedidos/pedir" element={<FormularioPedido />} />
                        <Route path="membresias" element={<ListaMembresias />} />
                        <Route path="membresias/crear" element={<FormularioMembresia />} />
                        <Route path="membresias/editar/:id" element={<FormularioMembresia />} />
                        <Route path="membresias/clases" element={<ListaClasesPersonalizadas />} />
                        <Route path="membresias/clases/crear" element={<FormularioClasePersonalizada />} />
                        <Route path="membresias/clases/editar/:id" element={<FormularioClasePersonalizada />} />
                        <Route path="membresias/ventas" element={<ListaVentasMembresias />} />
                        <Route path="membresias/ventas/crear" element={<FormularioVentaMembresia />} />
                        <Route path="clientes" element={<ListaClientes />} />
                        <Route path="clientes/crear" element={<FormularioClientes />} />
                        <Route path="clientes/editar/:id" element={<FormularioClientes />} />
                        <Route path="proveedores" element={<ListaProveedores />} />
                        <Route path="proveedores/crear" element={<FormularioProveedores />} />
                        <Route path="proveedores/editar/:id" element={<FormularioProveedores />} />
                        <Route path="reportes" element={<Reportes />} />
                    </Route>
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </Router>
        </AuthProvider>
    );
}

export default App;
