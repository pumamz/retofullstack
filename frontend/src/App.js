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
import ListaMembresia from "./pages/membresias/ListaMembresia";
import NuevaMembresia from "./pages/membresias/NuevaMembresia";
import EditarMembresia from "./pages/membresias/EditarMembresia";
import ListaVentasMembresias from "./pages/membresias/ListaVentasMembresias";
import NuevaVentaMembresia from "./pages/membresias/NuevaVentaMembresia";
import ListaClasesPersonalizadas from "./pages/membresias/ListaClasesPersonalizadas";
import NuevaClasePersonalizada from "./pages/membresias/NuevaClasePersonalizada";
import EditarClasePersonalizada from "./pages/membresias/EditarClasePersonalizada";
import ListaClientes from "./pages/usuarios/ListaClientes";
import ListaProveedores from "./pages/usuarios/ListaProveedores";
import CrearProveedor from "./pages/usuarios/FormularioProveedores";
import EditarProveedor from "./pages/usuarios/FormularioProveedores";
import Reportes from "./pages/reportes/Reportes";
import FormularioClientes from "./pages/usuarios/FormularioClientes";

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
                        <Route path="membresias" element={<ListaMembresia />} />
                        <Route path="membresias/crear" element={<NuevaMembresia />} />
                        <Route path="membresias/editar/:id" element={<EditarMembresia />} />
                        <Route path="membresias/clases" element={<ListaClasesPersonalizadas />} />
                        <Route path="membresias/clases/crear" element={<NuevaClasePersonalizada />} />
                        <Route path="membresias/clases/editar/:id" element={<EditarClasePersonalizada />} />
                        <Route path="membresias/ventas/lista" element={<ListaVentasMembresias />} />
                        <Route path="membresias/ventas/nueva" element={<NuevaVentaMembresia />} />
                        <Route path="clientes" element={<ListaClientes />} />
                        <Route path="clientes/crear" element={<FormularioClientes />} />
                        <Route path="clientes/editar/:id" element={<FormularioClientes />} />
                        <Route path="proveedores" element={<ListaProveedores />} />
                        <Route path="proveedores/crear" element={<CrearProveedor />} />
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
