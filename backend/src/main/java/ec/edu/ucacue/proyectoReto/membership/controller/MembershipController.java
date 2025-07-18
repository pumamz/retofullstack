package ec.edu.ucacue.proyectoReto.membership.controller;

import ec.edu.ucacue.proyectoReto.membership.model.Membership;
import ec.edu.ucacue.proyectoReto.membership.service.MembershipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships")
@CrossOrigin(origins = "http://localhost:3000")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @GetMapping
    public ResponseEntity<List<Membership>> getAllMemberships() {
        return ResponseEntity.ok(membershipService.getAllMemberships());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Membership>> getActiveMemberships() {
        return ResponseEntity.ok(membershipService.getEnabledMemberships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Membership> getMembershipById(@PathVariable Long id) {
        return ResponseEntity.ok(membershipService.getMembershipById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Membership>> searchMemberships(@RequestParam String searchTerm) {
        return ResponseEntity.ok(membershipService.searchMemberships(searchTerm));
    }

    @PostMapping
    public ResponseEntity<Membership> createMembership(@Valid @RequestBody Membership membership) {
        Membership createdMembership = membershipService.createMembership(membership);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMembership);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Membership> updateMembership(@PathVariable Long id, @Valid @RequestBody Membership membership) {
        Membership updatedMembership = membershipService.updateMembership(id, membership);
        return ResponseEntity.ok(updatedMembership);
    }

    @PatchMapping("/{id}/enable")
    public ResponseEntity<Void> toggleMembershipStatus(@PathVariable Long id, @RequestParam boolean enabled) {
        membershipService.toggleEnabled(id, enabled);
        return ResponseEntity.ok().build();
    }
}