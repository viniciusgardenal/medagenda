import React, { useState, useEffect } from "react";
import {
  criarSolicitacaoExames,
  getTiposExames,
  getPacientes,
} from "../../config/apiServices";
import ReceitaForm from "../receitas/receitaForm"; // Assumindo que este componente seleciona o profissional
import { toast } from 'react-toastify'; // AJUSTE: Importação do toast

const ModalSolicitacaoExames = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    idTipoExame: "",
    cpfPaciente: "",
    matriculaProfissional: "",
    periodo: "",
    dataSolicitacao: new Date().toISOString().split("T")[0],
    dataRetorno: "",
    justificativa: "",
    status: "Ativo",
  });
  
  const [tiposDeExame, setTiposDeExame] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [tiposExameRes, pacientesRes] = await Promise.all([getTiposExames(), getPacientes()]);
          setTiposDeExame(tiposExameRes.data || []);
          setPacientes(pacientesRes.data || []);
        } catch (error) {
          toast.error("Erro ao carregar dados para a modal.");
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMatriculaChange = (matricula) => {
    setFormData(prev => ({ ...prev, matriculaProfissional: matricula }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await criarSolicitacaoExames(formData);
      onSave(response.data); // Passa o novo objeto para o pai
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar solicitação.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">Nova Solicitação</h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Exame</label>
            <select name="idTipoExame" value={formData.idTipoExame} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
              <option value="">Selecione o Tipo de Exame</option>
              {tiposDeExame.map(tipo => <option key={tipo.idTipoExame} value={tipo.idTipoExame}>{tipo.nomeTipoExame}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Paciente</label>
            <select name="cpfPaciente" value={formData.cpfPaciente} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
              <option value="">Selecione o Paciente</option>
              {pacientes.map(p => <option key={p.cpf} value={p.cpf}>{p.nome} {p.sobrenome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Profissional Solicitante</label>
            <ReceitaForm onMatriculaChange={handleMatriculaChange} />
          </div>
          <div>
            <label className="block text-sm font-medium">Período</label>
            <select name="periodo" value={formData.periodo} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
              <option value="">Selecione</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Data de Retorno</label>
            <input type="date" name="dataRetorno" value={formData.dataRetorno} onChange={handleChange} min={formData.dataSolicitacao} required className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Justificativa</label>
            <textarea name="justificativa" value={formData.justificativa} onChange={handleChange} rows="4" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <div className="col-span-2 flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSolicitacaoExames;