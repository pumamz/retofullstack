package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {
    
    private final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Client> listClient() {
        return clientRepository.findAll();
    }

    @Override
    public List<Client> listEnabledClients() {
        return clientRepository.findClientsByEnabledTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Client findClientById(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));
    }

    @Override
    @Transactional
    public void createClient(Client client) {
        validateClientData(client);
        clientRepository.save(client);
    }

    @Override
    @Transactional
    public void editClient(Client client) {
        Client existingClient = findClientById(client.getId());
        validateClientData(client);
        existingClient.setDni(client.getDni());
        existingClient.setFirstName(client.getFirstName());
        existingClient.setLastName(client.getLastName());
        existingClient.setEmail(client.getEmail());
        existingClient.setPhone(client.getPhone());
        existingClient.setSex(client.getSex());
        existingClient.setAge(client.getAge());
        existingClient.setHeight(client.getHeight());
        existingClient.setWeight(client.getWeight());
        existingClient.setMembershipType(client.getMembershipType());
        
        clientRepository.save(existingClient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Client> searchClients(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return null;
        }
        return clientRepository.searchActiveClients(searchTerm);
    }

    @Override
    @Transactional
    public void toggleEnabled(Long id, boolean enabled) {
        Client client = findClientById(id);
        client.setEnabled(enabled);
        clientRepository.save(client);
    }

    private void validateClientData(Client client) {
        if (client.getDni() != null) {
            clientRepository.findByDni(client.getDni())
                .ifPresent(existingClient -> {
                    if (!existingClient.getId().equals(client.getId())) {
                        throw new RuntimeException("Ya existe un cliente con el DNI: " + client.getDni());
                    }
                });
        }
    }
}