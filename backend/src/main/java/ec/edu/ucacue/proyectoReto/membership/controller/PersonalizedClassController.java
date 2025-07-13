package ec.edu.ucacue.proyectoReto.membership.controller;

import ec.edu.ucacue.proyectoReto.membership.model.PersonalizedClass;
import ec.edu.ucacue.proyectoReto.membership.service.PersonalizedClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/personalized-classes")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonalizedClassController {

    @Autowired
    private PersonalizedClassService personalizedClassService;

    @GetMapping
    public ResponseEntity<List<PersonalizedClass>> getAllPersonalizedClasses() {
        return ResponseEntity.ok(personalizedClassService.getAllPersonalizedClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonalizedClass> getPersonalizedClassById(@PathVariable Long id) {
        return ResponseEntity.ok(personalizedClassService.getPersonalizedClassById(id));
    }

    @GetMapping("/client-dni/{dni}")
    public ResponseEntity<List<PersonalizedClass>> getByClientDni(@PathVariable String dni) {
        return ResponseEntity.ok(personalizedClassService.getPersonalizedClassesByClientDni(dni));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PersonalizedClass>> getPersonalizedClassesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(personalizedClassService.getPersonalizedClassesByDateRange(startDate, endDate));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PersonalizedClass>> getPersonalizedClassesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(personalizedClassService.getPersonalizedClassesByStatus(status));
    }

    @GetMapping("/scheduled/{date}")
    public ResponseEntity<List<PersonalizedClass>> getScheduledClassesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(personalizedClassService.getScheduledClassesByDate(date));
    }

    @GetMapping("/client/{clientId}/status/{status}")
    public ResponseEntity<List<PersonalizedClass>> getPersonalizedClassesByClientAndStatus(
            @PathVariable Long clientId, @PathVariable String status) {
        return ResponseEntity.ok(personalizedClassService.getPersonalizedClassesByClientAndStatus(clientId, status));
    }

    @PostMapping
    public ResponseEntity<PersonalizedClass> createPersonalizedClass(@Valid @RequestBody PersonalizedClass personalizedClass) {
        PersonalizedClass createdClass = personalizedClassService.createPersonalizedClass(personalizedClass);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonalizedClass> updatePersonalizedClass(@PathVariable Long id, @Valid @RequestBody PersonalizedClass personalizedClass) {
        PersonalizedClass updatedClass = personalizedClassService.updatePersonalizedClass(id, personalizedClass);
        return ResponseEntity.ok(updatedClass);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersonalizedClass(@PathVariable Long id) {
        personalizedClassService.deletePersonalizedClass(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> completePersonalizedClass(@PathVariable Long id) {
        personalizedClassService.completePersonalizedClass(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelPersonalizedClass(@PathVariable Long id) {
        personalizedClassService.cancelPersonalizedClass(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<PersonalizedClass> reschedulePersonalizedClass(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) java.time.LocalTime newTime) {
        PersonalizedClass rescheduledClass = personalizedClassService.reschedulePersonalizedClass(id, newDate, newTime);
        return ResponseEntity.ok(rescheduledClass);
    }
}