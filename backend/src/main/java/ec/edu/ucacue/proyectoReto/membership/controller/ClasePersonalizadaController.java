package ec.edu.ucacue.proyectoReto.membership.controller;

import java.util.List;
import ec.edu.ucacue.proyectoReto.membership.model.ClasePersonalizada;
import ec.edu.ucacue.proyectoReto.membership.service.ClasePersonalizadaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clases")
@CrossOrigin(origins = "http://localhost:3000")
public class ClasePersonalizadaController {
    private final ClasePersonalizadaService claseService;

    public ClasePersonalizadaController(ClasePersonalizadaService claseService) {
        this.claseService = claseService;
    }

    @PostMapping
    public ResponseEntity<ClasePersonalizada> crear(@RequestBody ClasePersonalizada clase) {
        return ResponseEntity.ok(claseService.crearClase(clase));
    }

    @GetMapping
    public List<ClasePersonalizada> obtenerTodas() {
        return claseService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClasePersonalizada> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(claseService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClasePersonalizada> actualizar(@PathVariable Long id, @RequestBody ClasePersonalizada clase) {
        return ResponseEntity.ok(claseService.actualizar(id, clase));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        claseService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
