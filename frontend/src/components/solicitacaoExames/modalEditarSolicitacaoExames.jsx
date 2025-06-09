import React, { useState, useEffect } from "react";
import {
  getTiposExames,
  updateSolicitacaoExames,
} from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import { toast } from 'react-toastify'; // AJUSTE: Importação do toast

const ModalEditarSolicitacaoExames = ({
  isOpen,
  onClose,
  solicitacaoExames,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    idTipoExame: "",
    periodo: "",
    dataSolicitacao: "",
    dataRetorno: "",
    justificativa: "",
    status: "Ativo",
    pacienteNome: "",
    profissionalNome: "",
  });

  const [tiposDeExame, setTiposDeExame] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatarDataParaInput = (dataStr) => {
    if (!dataStr) return "";
    return dataStr.split("T")[0];
  };

  useEffect(() => {
    if (solicitacaoExames) {
      setFormData({
        idTipoExame: solicitacaoExames.tipoExame?.idTipoExame ?? "",
        periodo: solicitacaoExames.periodo || "",
        dataSolicitacao: formatarDataParaInput(solicitacaoExames.dataSolicitacao),
        dataRetorno: formatarDataParaInput(solicitacaoExames.dataRetorno),
        justificativa: solicitacaoExames.justificativa || "",
        status: solicitacaoExames.status || "Ativo",
        pacienteNome: `${solicitacaoExames.paciente?.nome || ""} ${solicitacaoExames.paciente?.sobrenome || ""}`.trim(),
        profissionalNome: solicitacaoExames.profissional?.nome || "",
      });
    }

    const fetchTiposExames = async () => {
      try {
        const response = await getTiposExames();
        setTiposDeExame(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de exame:", error);
      }
    };
    if (isOpen) {
      fetchTiposExames();
    }
  }, [solicitacaoExames, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const { pacienteNome, profissionalNome, ...dadosParaEnviar } = formData;

    try {
      const response = await updateSolicitacaoExames(
        solicitacaoExames.idSolicitacaoExame,
        dadosParaEnviar
      );
      onUpdate(response.exame);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Falha ao atualizar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
            &times;
        </button>
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">Editar Solicitação</h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Exame</label>
            <select name="idTipoExame" value={formData.idTipoExame} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
              <option value="">Selecione um tipo de exame</option>
              {tiposDeExame.map((tipo) => (
                <option key={tipo.idTipoExame} value={tipo.idTipoExame}>{tipo.nomeTipoExame}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paciente</label>
            <input type="text" value={formData.pacienteNome} disabled className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profissional</label>
            <input type="text" value={formData.profissionalNome} disabled className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data da Solicitação</label>
            <input type="date" name="dataSolicitacao" value={formData.dataSolicitacao} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Retorno</label>
            <input type="date" name="dataRetorno" value={formData.dataRetorno} onChange={handleChange} min={formData.dataSolicitacao} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Período</label>
            <select name="periodo" value={formData.periodo} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
              <option value="">Selecione</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
              <option value="Ativo">Solicitado</option>
              <option value="Inativo">Registrado</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Justificativa</label>
            <textarea name="justificativa" value={formData.justificativa} onChange={handleChange} rows={4} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm resize-none" />
          </div>
          <div className="col-span-2 flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AJUSTE: Adicionando a exportação padrão que faltava
export default ModalEditarSolicitacaoExames;