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
            personalizedClass.setStatus("SCHEDULED");
        }

        if (personalizedClass.getCreationDate() == null) {
            personalizedClass.setCreationDate(LocalDate.now());
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
        if ("COMPLETED".equals(existingClass.getStatus()) || "CANCELLED".equals(existingClass.getStatus())) {
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

        // Only allow deletion if the class is scheduled (not completed or cancelled)
        if (!"SCHEDULED".equals(personalizedClass.getStatus())) {
            throw new IllegalArgumentException("Can only delete scheduled classes");
        }

        personalizedClassRepository.delete(personalizedClass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalizedClass> getPersonalizedClassesByClient(Long clientId) {
        return personalizedClassRepository.findByClientId(clientId);
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

        if (!"SCHEDULED".equals(personalizedClass.getStatus())) {
            throw new IllegalArgumentException("Can only complete scheduled classes");
        }

        personalizedClass.setStatus("COMPLETED");
        personalizedClassRepository.save(personalizedClass);
    }

    @Override
    public void cancelPersonalizedClass(Long id) {
        PersonalizedClass personalizedClass = getPersonalizedClassById(id);

        if (!"SCHEDULED".equals(personalizedClass.getStatus())) {
            throw new IllegalArgumentException("Can only cancel scheduled classes");
        }

        personalizedClass.setStatus("CANCELLED");
        personalizedClassRepository.save(personalizedClass);
    }

    @Override
    public PersonalizedClass reschedulePersonalizedClass(Long id, LocalDate newDate, LocalTime newTime) {
        PersonalizedClass personalizedClass = getPersonalizedClassById(id);
        return personalizedClass;
    }

    @Override
    public List<PersonalizedClass> getUpcomingClasses(int days) {
        return List.of();
    }

    @Override
    public List<PersonalizedClass> getTodayClasses() {
        return List.of();
    }

    public void validatePersonalizedClassData(PersonalizedClass personalizedClass) {

    }
}
