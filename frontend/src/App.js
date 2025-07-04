import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from "./components/layout/PrivateLayout";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/dashboard/Home";
import ListaProductos from "./pages/productos/ListaProductos";
import FormularioProducto from "./pages/productos/FormularioProducto";
import ListaVentas from "./pages/productos/ListaVentas";
import NuevaVenta from "./pages/productos/NuevaVenta";
import ListaPedidos from "./pages/productos/ListaPedidos";
import NuevoPedido from "./pages/productos/NuevoPedido";
import Profile from "./pages/dashboard/Profile";
import ListaMembresias from "./pages/membresias/ListaMembresias";
import FormularioMembresias from "./pages/membresias/FormularioMembresias";
import VentasClases from "./pages/membresias/VentasClases";
import VenderClase from "./pages/membresias/VenderClase";
import VentasMembresias from "./pages/membresias/VentasMembresias";
import VenderMembresias from "./pages/membresias/VenderMembresias";
import ListaClientes from "./pages/usuarios/ListaClientes";
import CrearCliente from "./pages/usuarios/FormularioClientes";
import EditarCliente from "./pages/usuarios/FormularioClientes";
import ListaProveedores from "./pages/usuarios/ListaProveedores";
import CrearProveedor from "./pages/usuarios/FormularioProveedores";
import EditarProveedor from "./pages/usuarios/FormularioProveedores";
import Reportes from "./pages/reportes/Reportes";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* Rutas protegidas bajo layout con Navbar */}
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
                        <Route path="productos/ventas/vender" element={<NuevaVenta />} />
                        <Route path="productos/pedidos" element={<ListaPedidos />} />
                        <Route path="productos/pedidos/pedir" element={<NuevoPedido />} />
                        <Route path="membresias" element={<ListaMembresias />} />
                        <Route path="membresias/crear" element={<FormularioMembresias />} />
                        <Route path="membresias/clases" element={<VentasClases />} />
                        <Route path="membresias/clases/vender" element={<VenderClase />} />
                        <Route path="membresias/ventas" element={<VentasMembresias />} />
                        <Route path="membresias/ventas/vender" element={<VenderMembresias />} />
                        <Route path="clientes" element={<ListaClientes />} />
                        <Route path="clientes/nuevo" element={<CrearCliente />} />
                        <Route path="clientes/editar/:id" element={<EditarCliente />} />
                        <Route path="proveedores" element={<ListaProveedores />} />
                        <Route path="proveedores/nuevo" element={<CrearProveedor />} />
                        <Route path="proveedores/editar/:id" element={<EditarProveedor />} />
                        <Route path="reportes" element={<Reportes />} />
                    </Route>
                </Routes>
            </Router>
            <Toaster position="top-right" />
        </AuthProvider>
    );
}

export default App;
