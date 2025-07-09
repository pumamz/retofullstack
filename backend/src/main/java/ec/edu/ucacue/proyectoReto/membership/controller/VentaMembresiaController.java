package ec.edu.ucacue.proyectoReto.membership.controller;

import java.util.List;

import ec.edu.ucacue.proyectoReto.membership.model.VentaMembresia;
import ec.edu.ucacue.proyectoReto.membership.service.VentaMembresiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ventas-membresia")
@CrossOrigin(origins = "http://localhost:3000")
public class VentaMembresiaController {

    private final VentaMembresiaService ventaService;

    public VentaMembresiaController(VentaMembresiaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping
    public ResponseEntity<VentaMembresia> crear(@RequestBody VentaMembresia venta) {
        return ResponseEntity.ok(ventaService.crearVenta(venta));
    }

    @GetMapping
    public List<VentaMembresia> obtenerTodas() {
        return ventaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaMembresia> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ventaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}