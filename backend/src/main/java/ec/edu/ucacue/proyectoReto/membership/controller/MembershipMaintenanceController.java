package ec.edu.ucacue.proyectoReto.membership.controller;

import ec.edu.ucacue.proyectoReto.membership.service.MembershipMaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/membership-maintenance")
public class MembershipMaintenanceController {

    private final MembershipMaintenanceService maintenanceService;

    public MembershipMaintenanceController(MembershipMaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping("/update-statuses")
    public ResponseEntity<Void> updateMembershipStatuses() {
        maintenanceService.updateMembershipStatuses();
        return ResponseEntity.ok().build();
    }
}
