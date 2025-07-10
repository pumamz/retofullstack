package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.PersonalizedClass;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface PersonalizedClassService {

    PersonalizedClass createPersonalizedClass(PersonalizedClass personalizedClass);

    List<PersonalizedClass> getAllPersonalizedClasses();

    PersonalizedClass getPersonalizedClassById(Long id);

    PersonalizedClass updatePersonalizedClass(Long id, PersonalizedClass personalizedClass);

    void deletePersonalizedClass(Long id);

    List<PersonalizedClass> getPersonalizedClassesByClient(Long clientId);

    List<PersonalizedClass> getPersonalizedClassesByDateRange(LocalDate startDate, LocalDate endDate);

    List<PersonalizedClass> getPersonalizedClassesByStatus(String status);

    List<PersonalizedClass> getPersonalizedClassesByClientAndStatus(Long clientId, String status);

    List<PersonalizedClass> getScheduledClassesByDate(LocalDate date);

    void completePersonalizedClass(Long id);

    void cancelPersonalizedClass(Long id);

    PersonalizedClass reschedulePersonalizedClass(Long id, LocalDate newDate, LocalTime newTime);

    List<PersonalizedClass> getUpcomingClasses(int days);

    List<PersonalizedClass> getTodayClasses();
}