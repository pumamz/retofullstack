package ec.edu.ucacue.proyectoReto.membership.controller;

import java.util.List;

import ec.edu.ucacue.proyectoReto.membership.model.Membresia;
import ec.edu.ucacue.proyectoReto.membership.service.MembresiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/membresias")
@CrossOrigin(origins = "http://localhost:3000")
public class MembresiaController {

    private final MembresiaService membresiaService;

    // Constructor con inyección de dependencias
    public MembresiaController(MembresiaService membresiaService) {
        this.membresiaService = membresiaService;
    }

    @PostMapping
    public ResponseEntity<Membresia> crear(@RequestBody Membresia membresia) {
        return ResponseEntity.ok(membresiaService.crearMembresia(membresia));
    }

    @GetMapping
    public List<Membresia> obtenerTodas() {
        return membresiaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Membresia> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(membresiaService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Membresia> actualizar(@PathVariable Long id, @RequestBody Membresia membresia) {
        return ResponseEntity.ok(membresiaService.actualizar(id, membresia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        membresiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
