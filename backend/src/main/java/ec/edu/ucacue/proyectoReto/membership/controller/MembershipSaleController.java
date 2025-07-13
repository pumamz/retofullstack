package ec.edu.ucacue.proyectoReto.membership.controller;

import ec.edu.ucacue.proyectoReto.membership.model.MembershipSale;
import ec.edu.ucacue.proyectoReto.membership.service.MembershipSaleService;
import ec.edu.ucacue.proyectoReto.users.model.Client;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/membership-sales")
@CrossOrigin(origins = "http://localhost:3000")
public class MembershipSaleController {

    @Autowired
    private MembershipSaleService membershipSaleService;

    @GetMapping
    public ResponseEntity<List<MembershipSale>> getAllMembershipSales() {
        return ResponseEntity.ok(membershipSaleService.getAllMembershipSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipSale> getMembershipSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(membershipSaleService.getMembershipSaleById(id));
    }

    @GetMapping("/client/{dni}")
    public ResponseEntity<List<MembershipSale>> getMembershipSalesByClient(@PathVariable String dni) {
        return ResponseEntity.ok(membershipSaleService.getMembershipSalesByClient(dni));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<MembershipSale>> getMembershipSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(membershipSaleService.getMembershipSalesByDateRange(startDate, endDate));
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<MembershipSale>> getMembershipsExpiringSoon(
            @RequestParam(defaultValue = "7") int days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        return ResponseEntity.ok(membershipSaleService.getMembershipsExpiringBetween(today, endDate));
    }

    @GetMapping("/expired")
    public ResponseEntity<List<MembershipSale>> getExpiredMemberships() {
        return ResponseEntity.ok(membershipSaleService.getExpiredMemberships());
    }

    @GetMapping("/clients-expiring-soon")
    public ResponseEntity<List<Client>> getClientsWithMembershipsExpiringSoon(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(membershipSaleService.getClientsWithMembershipsExpiringSoon(days));
    }

    @PostMapping
    public ResponseEntity<MembershipSale> createMembershipSale(@Valid @RequestBody MembershipSale membershipSale) {
        MembershipSale createdSale = membershipSaleService.createMembershipSale(membershipSale);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSale);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelMembershipSale(@PathVariable Long id) {
        membershipSaleService.cancelMembershipSale(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-expired")
    public ResponseEntity<Void> updateExpiredMemberships() {
        membershipSaleService.updateExpiredMemberships();
        return ResponseEntity.ok().build();
    }
}