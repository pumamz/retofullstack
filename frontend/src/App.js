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
import Profile from "./pages/dashboard/Profile";

import ListaProductos from "./pages/productos/ListaProductos";
import FormularioProducto from "./pages/productos/FormularioProducto";
import ListaVentas from "./pages/productos/ListaVentas";
import FormularioVenta from "./pages/productos/FormularioVenta";
import ListaPedidos from "./pages/productos/ListaPedidos";
import FormularioPedido from "./pages/productos/FormularioPedido";

import ListaMembresias from "./pages/membresias/ListaMembresias";
import FormularioMembresia from "./pages/membresias/FormularioMembresia";
import ListaVentasMembresias from "./pages/membresias/ListaVentasMembresias";
import FormularioVentaMembresia from "./pages/membresias/FormularioVentaMembresia";
import ListaClasesPersonalizadas from "./pages/membresias/ListaClasesPersonalizadas";
import FormularioClasePersonalizada from "./pages/membresias/FormularioClasePersonalizada";

import ListaClientes from "./pages/usuarios/ListaClientes";
import ListaProveedores from "./pages/usuarios/ListaProveedores";
import FormularioProveedores from "./pages/usuarios/FormularioProveedores";
import FormularioClientes from "./pages/usuarios/FormularioClientes";

import Reportes from "./pages/reportes/Reportes";
import ReporteMembresias from "./pages/reportes/ReporteMembresias";
import ReporteClasesPersonalizadas from "./pages/reportes/ReporteClasesPersonalizadas";
import ReporteVentasProductos from "./pages/reportes/ReporteVentasProductos";
import ReporteClientes from "./pages/reportes/ReporteClientes";
import ReporteProductos from "./pages/reportes/ReporteProductos";
import ReportePedidos from "./pages/reportes/ReportePedidos";
import ReporteProveedores from "./pages/reportes/ReporteProveedores";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Rutas privadas */}
                    <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                        {/* Dashboard principal */}
                        <Route index element={<Home />} />
                        <Route path="user/perfil" element={<Profile />} />

                        {/* Productos */}
                        <Route path="productos" >
                            <Route index element={<ListaProductos />} />
                            <Route path="crear" element={<FormularioProducto />} />
                            <Route path="editar/:id" element={<FormularioProducto />} />
                            <Route path="ventas" >
                                <Route index element={<ListaVentas />} />
                                <Route path="crear" element={<FormularioVenta />} />
                            </Route>
                            <Route path="pedidos" >
                                <Route index element={<ListaPedidos />} />
                                <Route path="crear" element={<FormularioPedido />} />
                            </Route>
                        </Route>

                        {/* Membresías y clases */}
                        <Route path="membresias" >
                            <Route index element={<ListaMembresias />} />
                            <Route path="crear" element={<FormularioMembresia />} />
                            <Route path="editar/:id" element={<FormularioMembresia />} />
                            <Route path="clases" >
                                <Route index element={<ListaClasesPersonalizadas />} />
                                <Route path="crear" element={<FormularioClasePersonalizada />} />
                                <Route path="editar/:id" element={<FormularioClasePersonalizada />} />
                            </Route>
                            <Route path="ventas" >
                                <Route index element={<ListaVentasMembresias />} />
                                <Route path="crear" element={<FormularioVentaMembresia />} />
                            </Route>
                        </Route>

                        {/* Usuarios */}
                        <Route path="clientes" >
                            <Route index element={<ListaClientes />} />
                            <Route path="crear" element={<FormularioClientes />} />
                            <Route path="editar/:id" element={<FormularioClientes />} />
                        </Route>

                        <Route path="proveedores" >
                            <Route index element={<ListaProveedores />} />
                            <Route path="crear" element={<FormularioProveedores />} />
                            <Route path="editar/:id" element={<FormularioProveedores />} />
                        </Route>

                        {/* Reportes */}
                        <Route path="reportes" element={<Reportes />}>
                            <Route index element={<Reportes />} /> {/* Dashboard general reportes */}
                            <Route path="membresias" element={<ReporteMembresias />} />
                            <Route path="clases" element={<ReporteClasesPersonalizadas />} />
                            <Route path="ventas" element={<ReporteVentasProductos />} />
                            <Route path="clientes" element={<ReporteClientes />} />
                            <Route path="productos" element={<ReporteProductos />} />
                            <Route path="pedidos" element={<ReportePedidos />} />
                            <Route path="proveedores" element={<ReporteProveedores />} />
                        </Route>

                    </Route>
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </Router>
        </AuthProvider>
    );
}

export default App;
