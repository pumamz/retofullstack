package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Client;

import java.util.List;

public interface ClientService {
  public List<Client> listClient();
  public Client findClientById(Long id);
public  void    createClient(Client client);
public void deleteClientById(Long id);
public void editClient(Client client);
}
