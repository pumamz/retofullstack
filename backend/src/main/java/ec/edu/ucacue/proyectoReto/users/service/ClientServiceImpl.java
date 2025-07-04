package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {
    @Autowired
    private ClientRepository clientRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Client> listClient() {

        return  clientRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Client findClientById(Long id) {
        return clientRepository.findById(id).orElseThrow(( )->new RuntimeException("Id no encontrado"));
    }

    @Override
    public void createClient(Client client) {
    clientRepository.save(client);
    }


    @Override
    public void deleteClientById(Long id) {
clientRepository.deleteById(id);
    }

    @Override
    public void editClient(Client client) {

    }
}
