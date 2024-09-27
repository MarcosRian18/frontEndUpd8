import React, { useEffect, useState } from 'react';
import authService from '../services/api'; 
import Navbar from '../components/Navbar';
import InputMask from 'react-input-mask';

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [consultaModalVisible, setConsultaModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({ nome: '', cpf: '', data_nascimento: '', sexo: '', endereco: '', estado_id: '', cidade_id: '' });
  const [editClient, setEditClient] = useState(null);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [clientesPerPage] = useState(10);

  const fetchClientes = async () => {
    try {
      const data = await authService.getClients();
      setClientes(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchEstados = async () => {
    try {
      const data = await authService.getEstados();
      setEstados(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCidades = async (estadoId) => {
    try {
      const data = await authService.getCidades(estadoId);
      setCidades(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEstadoChange = (e) => {
    const estadoId = e.target.value;
    setNewClient({ ...newClient, estado_id: estadoId });
    fetchCidades(estadoId);
  };

  const handleAddClient = async () => {
    try {
      const formattedCpf = newClient.cpf.replace(/\D/g, '');
      const clientData = { ...newClient, cpf: formattedCpf };
      
      await authService.addClient(clientData);
      setNewClient({ nome: '', cpf: '', data_nascimento: '', sexo: '', endereco: '', estado_id: '', cidade_id: '' });
      setModalVisible(false);
      fetchClientes();
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este cliente?");
    if (!confirmDelete) return; 
    
    try {
      await authService.deleteClient(id);
      fetchClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      setError(error.message);
    }
  };

  const handleEdit = (cliente) => {
    setEditClient(cliente); 
    setNewClient(cliente); 
    setModalVisible(true); 
  };

  const handleUpdateClient = async () => {
    try {
      const formattedCpf = newClient.cpf.replace(/\D/g, '');
      const clientData = { ...newClient, cpf: formattedCpf, id: editClient.id }; 
  
      await authService.updateClient(clientData); 
      setNewClient({ nome: '', cpf: '', data_nascimento: '', sexo: '', endereco: '', estado_id: '', cidade_id: '' });
      setEditClient(null); 
      setModalVisible(false);
      fetchClientes();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchEstados();
  }, []);

  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const indexOfLastClient = currentPage * clientesPerPage;
  const indexOfFirstClient = indexOfLastClient - clientesPerPage;
  const currentClientes = filteredClientes.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClientes.length / clientesPerPage);

  const getEstadoNome = (estadoId) => {
    const estado = estados.find(e => e.id === estadoId);
    return estado ? estado.sigla : ''; 
  };

  const getCidadeNome = (cidadeId) => {
    const cidade = cidades.find(c => c.id === cidadeId);
    return cidade ? cidade.nome : ''; 
  };

  return (
    <div className="dashboard" style={{ backgroundColor: '#0d1f28', color: '#ffffff', minHeight: '100vh', padding: '20px' }}>
      <Navbar />
      <h2 className="title" style={{ marginTop: '40px', textAlign: 'center', color: 'white' }}>Lista de Clientes</h2>
      {error && <div className="notification is-danger">{error}</div>}

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={() => setModalVisible(true)} className="button is-success" style={{ marginRight: '10px' }}>
          Cadastrar Cliente
        </button>
      </div>

      {(modalVisible || editClient) && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setModalVisible(false)}></div>
          <div className="modal-content" style={{ maxWidth: '500px', margin: 'auto', backgroundColor: '#2e2e2e', padding: '20px', borderRadius: '8px' }}>
            <h3 className="title" style={{ color: 'white', textAlign: 'center' }}>{editClient ? 'Editar Cliente' : 'Cadastrar Cliente'}</h3>
            <div>
              <label className="has-text-white label">Nome:</label>
              <input className="input" type="text" value={newClient.nome} onChange={(e) => setNewClient({ ...newClient, nome: e.target.value })} />

              <label className="has-text-white label">CPF:</label>
              <InputMask
                mask="999.999.999-99"
                className="input"
                value={newClient.cpf}
                onChange={(e) => setNewClient({ ...newClient, cpf: e.target.value })}
              />

              <label className="has-text-white label">Data de Nascimento: </label>
              <input className="input" type="date" value={newClient.data_nascimento} onChange={(e) => setNewClient({ ...newClient, data_nascimento: e.target.value })} />

              <label className="has-text-white label">Sexo:</label>
              <select className="select" value={newClient.sexo} onChange={(e) => setNewClient({ ...newClient, sexo: e.target.value })}>
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>

              <label className="has-text-white label">Endereço: </label>
              <input className="input" type="text" value={newClient.endereco} onChange={(e) => setNewClient({ ...newClient, endereco: e.target.value })} />

              <label className="has-text-white label">Estado:</label>
              <select className="select" value={newClient.estado_id} onChange={handleEstadoChange}>
                <option value="">Selecione um estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nome}
                  </option>
                ))}
              </select>

              <label className="has-text-white label">Cidade:</label>
              <select className="select" value={newClient.cidade_id} onChange={(e) => setNewClient({ ...newClient, cidade_id: e.target.value })}>
                <option value="">Selecione uma cidade</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button className="button is-success" onClick={editClient ? handleUpdateClient : handleAddClient}>
                {editClient ? 'Alterar' : 'Salvar'}
              </button>
              <button className="button" onClick={() => { setModalVisible(false); setEditClient(null); }} style={{ marginLeft: '10px' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          className="input"
          type="text"
          placeholder="Pesquisar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '60%', marginBottom: '20px' }}
        />
      </div>

      <table className="table is-striped " style={{ margin: 'auto', width: '80%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th className='has-text-centered'>Nome</th>
            <th className='has-text-centered'>CPF</th>
            <th className='has-text-centered'>Data de Nascimento</th>
            <th className='has-text-centered'>Sexo</th>
            <th className='has-text-centered'>Endereço</th>
            <th className='has-text-centered'>Estado</th>
            <th className='has-text-centered'>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentClientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.cpf}</td>
              <td>{cliente.data_nascimento}</td>
              <td>{cliente.sexo}</td>
              <td>{cliente.endereco}</td>
              <td>{getEstadoNome(cliente.estado_id)}</td>
              <td>
                <button onClick={() => handleEdit(cliente)} className="button mr-3 is-small">Editar</button>
                <button onClick={() => handleDelete(cliente.id)} className="button is-small is-danger">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination" style={{marginTop: '20px' ,gap: '80px' ,justifyContent: 'center' ,alignItems: 'center', width: '100%'}}>
        <button className='button is-link' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button className='button is-link' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Próxima</button>
      </div>
    </div>
  );
}
