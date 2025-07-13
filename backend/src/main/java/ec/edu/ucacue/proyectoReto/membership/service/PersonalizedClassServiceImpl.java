package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.membership.model.PersonalizedClass;
import ec.edu.ucacue.proyectoReto.membership.repository.PersonalizedClassRepository;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@Service
@Transactional
public class PersonalizedClassServiceImpl implements PersonalizedClassService {

    @Autowired
    private PersonalizedClassRepository personalizedClassRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public PersonalizedClass createPersonalizedClass(PersonalizedClass personalizedClass) {
        validatePersonalizedClassData(personalizedClass);

        // Set default values
        if (personalizedClass.getStatus() == null) {
            personalizedClass.setStatus("Scheduled");
        }

        if (personalizedClass.getCreationDate() == null) {
            personalizedClass.setCreationDate(LocalDate.now(ZoneId.of("America/Guayaquil")));
        }

        return personalizedClassRepository.save(personalizedClass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getAllPersonalizedClasses() {
        return personalizedClassRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PersonalizedClass getPersonalizedClassById(Long id) {
        return personalizedClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personalized class not found with ID: " + id));
    }

    @Override
    public PersonalizedClass updatePersonalizedClass(Long id, PersonalizedClass personalizedClass) {
        PersonalizedClass existingClass = getPersonalizedClassById(id);

        // Validate that the class can be updated
        if ("Completed".equals(existingClass.getStatus()) || "Cancelled".equals(existingClass.getStatus())) {
            throw new IllegalArgumentException("Cannot update completed or cancelled class");
        }

        // Update fields
        if (personalizedClass.getClassName() != null && !personalizedClass.getClassName().trim().isEmpty()) {
            existingClass.setClassName(personalizedClass.getClassName());
        }

        if (personalizedClass.getDescription() != null) {
            existingClass.setDescription(personalizedClass.getDescription());
        }

        if (personalizedClass.getDate() != null) {
            // Validate that the new date is not in the past
            if (personalizedClass.getDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Cannot schedule class in the past");
            }
            existingClass.setDate(personalizedClass.getDate());
        }

        if (personalizedClass.getTime() != null) {
            existingClass.setTime(personalizedClass.getTime());
        }

        if (personalizedClass.getPrice() != null && personalizedClass.getPrice() > 0) {
            existingClass.setPrice(personalizedClass.getPrice());
        }

        if (personalizedClass.getPaymentMethod() != null && !personalizedClass.getPaymentMethod().trim().isEmpty()) {
            existingClass.setPaymentMethod(personalizedClass.getPaymentMethod());
        }

        return personalizedClassRepository.save(existingClass);
    }

    @Override
    public void deletePersonalizedClass(Long id) {
        PersonalizedClass personalizedClass = getPersonalizedClassById(id);

        // Only allow deletion if the class is scheduled (not completed or canceled)
        if (!"Scheduled".equals(personalizedClass.getStatus())) {
            throw new IllegalArgumentException("Can only delete scheduled classes");
        }

        personalizedClassRepository.delete(personalizedClass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getPersonalizedClassesByClientDni(String dni) {
        return personalizedClassRepository.findByClientDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getPersonalizedClassesByDateRange(LocalDate startDate, LocalDate endDate) {
        return personalizedClassRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getPersonalizedClassesByStatus(String status) {
        return personalizedClassRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getPersonalizedClassesByClientAndStatus(Long clientId, String status) {
        return personalizedClassRepository.findByClientIdAndStatus(clientId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getScheduledClassesByDate(LocalDate date) {
        return personalizedClassRepository.findScheduledClassesByDate(date);
    }

    @Override
    public void completePersonalizedClass(Long id) {
        PersonalizedClass personalizedClass = getPersonalizedClassById(id);

        if (!"Scheduled".equals(personalizedClass.getStatus())) {
            throw new IllegalArgumentException("Can only complete scheduled classes");
        }

        personalizedClass.setStatus("Completed");
        personalizedClassRepository.save(personalizedClass);
    }

    @Override
    public void cancelPersonalizedClass(Long id) {
        PersonalizedClass personalizedClass = getPersonalizedClassById(id);

        if (!"Scheduled".equals(personalizedClass.getStatus())) {
            throw new IllegalArgumentException("Can only cancel scheduled classes");
        }

        personalizedClass.setStatus("Cancelled");
        personalizedClassRepository.save(personalizedClass);
    }

    @Override
    public PersonalizedClass reschedulePersonalizedClass(Long id, LocalDate newDate, LocalTime newTime) {
        PersonalizedClass personalizedClass = getPersonalizedClassById(id);

        if (!"Scheduled".equals(personalizedClass.getStatus())) {
            throw new IllegalArgumentException("Can only reschedule scheduled classes");
        }

        // Validate new date is not in the past
        if (newDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot reschedule class to a past date");
        }

        // Validate new time is not in the past if it's today
        if (newDate.equals(LocalDate.now()) && newTime.isBefore(LocalTime.now())) {
            throw new IllegalArgumentException("Cannot reschedule class to a past time today");
        }

        personalizedClass.setDate(newDate);
        personalizedClass.setTime(newTime);

        return personalizedClassRepository.save(personalizedClass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getUpcomingClasses(int days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        return personalizedClassRepository.findByDateBetween(today, endDate)
                .stream()
                .filter(pc -> "Scheduled".equals(pc.getStatus()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getTodayClasses() {
        LocalDate today = LocalDate.now();
        return personalizedClassRepository.findScheduledClassesByDate(today);
    }

    private void validatePersonalizedClassData(PersonalizedClass personalizedClass) {
        if (personalizedClass == null) {
            throw new IllegalArgumentException("Personalized class cannot be null");
        }

        if (personalizedClass.getClassName() == null || personalizedClass.getClassName().trim().isEmpty()) {
            throw new IllegalArgumentException("Class name is required");
        }

        if (personalizedClass.getDate() == null) {
            throw new IllegalArgumentException("Class date is required");
        }

        if (personalizedClass.getTime() == null) {
            throw new IllegalArgumentException("Class time is required");
        }

        if (personalizedClass.getPrice() == null || personalizedClass.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }

        if (personalizedClass.getClient() == null || personalizedClass.getClient().getId() == null) {
            throw new IllegalArgumentException("Client is required");
        }

        // Validate that the date is not in the past
        if (personalizedClass.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot schedule class in the past");
        }

        // Validate that the time is not in the past if it's today
        if (personalizedClass.getDate().equals(LocalDate.now()) &&
                personalizedClass.getTime().isBefore(LocalTime.now())) {
            throw new IllegalArgumentException("Cannot schedule class in the past time today");
        }

        // Verify client exists
        clientRepository.findById(personalizedClass.getClient().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        // Validate status if provided
        if (personalizedClass.getStatus() != null) {
            String status = personalizedClass.getStatus();
            if (!"Scheduled".equals(status) && !"Completed".equals(status) && !"Cancelled".equals(status)) {
                throw new IllegalArgumentException("Invalid status. Must be Scheduled, Completed, or Cancelled");
            }
        }
    }
}