package ec.edu.ucacue.proyectoReto.users.controller;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.listClient());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findClientById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(@RequestParam String searchTerm) {
        return ResponseEntity.ok(clientService.searchClients(searchTerm));
    }

    @PostMapping
    public ResponseEntity<Void> createClient(@Valid @RequestBody Client client) {
        clientService.createClient(client);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateClient(@PathVariable Long id, @Valid @RequestBody Client client) {
        client.setId(id);
        clientService.editClient(client);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClientById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/enable")
    public ResponseEntity<Void> toggleClientStatus(@PathVariable Long id, @RequestParam boolean enabled) {
        clientService.toggleEnabled(id, enabled);
        return ResponseEntity.ok().build();
    }
}
