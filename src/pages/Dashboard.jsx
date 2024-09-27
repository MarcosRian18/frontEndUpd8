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
  const [searchTerm, setSearchTerm] = useState(''); u

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
        console.log("Estados:", data); 
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
      <h2 className="title" style={{ textAlign: 'center', color: 'white' }}>Lista de Clientes</h2>
      {error && <div className="notification is-danger">{error}</div>}

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={() => setModalVisible(true)} className="button is-success" style={{ marginRight: '10px' }}>
          Cadastrar Cliente
        </button>
        <button onClick={() => setConsultaModalVisible(true)} className="button is-info">
          Consultar Clientes
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

   
      {consultaModalVisible && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setConsultaModalVisible(false)}></div>
          <div className="modal-content" style={{ maxWidth: '500px', margin: 'auto', backgroundColor: '#2e2e2e', padding: '20px', borderRadius: '8px' }}>
            <h3 className="title" style={{ color: 'white', textAlign: 'center' }}>Consultar Clientes</h3>
            <p style={{textAlign: 'center', color: 'white' }}>Aqui você pode consultar os clientes cadastrados.</p>

          
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <input 
                className="input" 
                type="text" 
                placeholder="Buscar por nome..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                style={{ width: '80%', margin: '0 auto' }} 
              />
            </div>

   
            <div style={{ textAlign: 'center', margin: '10px 0' }}>
              {filteredClientes.length > 0 ? (
                filteredClientes.map(cliente => (
                  <p key={cliente.id} style={{ color: 'white' }}>{cliente.nome}</p>
                ))
              ) : (
                <p style={{ color: 'white' }}>Nenhum cliente encontrado.</p>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button className="button" onClick={() => setConsultaModalVisible(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

   
      <table className="table is-bordered" style={{ margin: '0 auto', width: '80%', backgroundColor: '#1e1e1e', color: '#ffffff', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', color: 'white', padding: '10px', border: '1px solid #ffffff' }}>ID</th>
            <th style={{ textAlign: 'center', color: 'white', padding: '10px', border: '1px solid #ffffff' }}>Nome</th>
            <th style={{ textAlign: 'center', color: 'white', padding: '10px', border: '1px solid #ffffff' }}>CPF</th>
            <th style={{ textAlign: 'center', color: 'white', padding: '10px', border: '1px solid #ffffff' }}>Data Nasc.</th>
            <th style={{ textAlign: 'center', color: 'white', padding: '10px', border: '1px solid #ffffff' }}>Estado</th>
            <th style={{ textAlign: 'center', color: 'white', padding: '10px', border: '1px solid #ffffff' }}>Sexo</th>
            <th style={{ textAlign: 'center', color: 'white', padding: '10px', border: '1px solid #ffffff' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} style={{ textAlign: 'center', backgroundColor: '#2e2e2e' }}>
              <td style={{ color: '#ffffff', padding: '10px', border: '1px solid #ffffff' }}>{cliente.id}</td>
              <td style={{ color: '#ffffff', padding: '10px', border: '1px solid #ffffff' }}>{cliente.nome}</td>
              <td style={{ color: '#ffffff', padding: '10px', border: '1px solid #ffffff' }}>{cliente.cpf}</td>
              <td style={{ color: '#ffffff', padding: '10px', border: '1px solid #ffffff' }}>{cliente.data_nascimento}</td>
              <td style={{ color: '#ffffff', padding: '10px', border: '1px solid #ffffff' }}>{getEstadoNome(cliente.estado_id)}</td>
              <td style={{ color: '#ffffff', padding: '10px', border: '1px solid #ffffff' }}>{cliente.sexo}</td>
              <td>
                <button onClick={() => handleEdit(cliente)} className="button is-info" style={{ marginRight: '10px' }}>Editar</button>
                <button onClick={() => handleDelete(cliente.id)} className="button is-danger">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
