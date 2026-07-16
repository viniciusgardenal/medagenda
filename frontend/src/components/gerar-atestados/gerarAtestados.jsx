import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  criarAtestado,
  lerAtestados,
  downloadAtestadoPdf,
  getPacientes,
} from "../../config/apiServices";
import ModalAddAtestado from "./modalAddAtestado";
import ModalViewAtestados from "./modalViewAtestado";
import ModalDetalhesAtestado from "./modalDetalhesAtestado";
import TableHeader from './TableHeader';
import Pagination from '../util/Pagination'; // Adicionado para a paginação
import { FaPlus } from "react-icons/fa";
import { Eye, Download } from "lucide-react";
import moment from "moment";

const GerarAtestados = () => {
  // --- Estados ---
  const [atestados, setAtestados] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAtestado, setSelectedAtestado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sortField, setSortField] = useState("dataEmissao");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filtros, setFiltros] = useState({ paciente: '', profissional: '', tipo: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [dadosAtestado, setDadosAtestado] = useState({
    cpfPaciente: "",
    matriculaProfissional: "",
    tipoAtestado: "Médico",
    motivo: "",
    observacoes: "",
  });

  const loadDados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Otimizado para buscar apenas os dados necessários para esta tela.
      const [atestadosRes, pacientesRes] = await Promise.all([
        lerAtestados(),
        getPacientes(),
      ]);
      const validAtestados = (Array.isArray(atestadosRes?.data) ? atestadosRes.data : []).filter(a => a && a.paciente && a.profissional);
      setAtestados(validAtestados);
      setPacientes(Array.isArray(pacientesRes.data) ? pacientesRes.data : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Não foi possível carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDados();
  }, [loadDados]);
  
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const dadosParaEnviar = { ...dadosAtestado };
      const response = await criarAtestado(dadosParaEnviar);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `atestado_${dadosAtestado.cpfPaciente}.pdf`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch?.length === 2) fileName = fileNameMatch[1];
      }
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage("Atestado gerado com sucesso!");
      setIsAddModalOpen(false);
      await loadDados();
    } catch (error) {
      console.error("Erro ao gerar atestado:", error);
      const errorMessage = error.response?.data?.error || "Erro ao gerar atestado.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (atestado) => {
    setError(null);
    try {
      const response = await downloadAtestadoPdf(atestado.idAtestado);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `atestado_${atestado.idAtestado}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar atestado:", error);
      setError("Erro ao baixar o PDF do atestado.");
    }
  };

  const openAddModal = () => { setIsAddModalOpen(true); setError(null); setSuccessMessage(null); };
  const openDetailsModal = (atestado) => { setSelectedAtestado(atestado); setIsDetailsModalOpen(true); };
  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
  }
  
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
  };
  
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const atestadosProcessados = useMemo(() => {
    let result = [...atestados];
    result = result.filter(a => 
      `${a.paciente?.nome} ${a.paciente?.sobrenome}`.toLowerCase().includes(filtros.paciente.toLowerCase()) &&
      (a.profissional?.nome || '').toLowerCase().includes(filtros.profissional.toLowerCase()) &&
      (a.tipoAtestado || '').toLowerCase().includes(filtros.tipo.toLowerCase())
    );
    result.sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        const fieldMap = {
            dataEmissao: item => moment(item.dataEmissao).valueOf(),
            paciente: item => `${item.paciente?.nome} ${item.paciente?.sobrenome}`.toLowerCase(),
            profissional: item => (item.profissional?.nome || '').toLowerCase(),
            tipoAtestado: item => (item.tipoAtestado || "").toLowerCase()
        };
        const valueA = fieldMap[sortField] ? fieldMap[sortField](a) : (a[sortField] || '');
        const valueB = fieldMap[sortField] ? fieldMap[sortField](b) : (b[sortField] || '');
        if (typeof valueA === 'number') return (valueA - valueB) * direction;
        return String(valueA).localeCompare(String(valueB)) * direction;
    });
    return result;
  }, [atestados, sortField, sortDirection, filtros]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAtestados = atestadosProcessados.slice(indexOfFirstItem, indexOfLastItem);
  
  const tableHeaders = [
    { label: "Data", field: "dataEmissao" }, { label: "Paciente", field: "paciente" },
    { label: "Profissional", field: "profissional" }, { label: "Tipo", field: "tipoAtestado" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Emitir Atestados</h2>
            <p className="text-sm text-slate-500 mt-0.5">Geração e controle de atestados médicos</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          >
            <FaPlus /> Novo Atestado
          </button>
        </div>

        {error && <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>}
        {successMessage && <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-sm text-emerald-700">{successMessage}</div>}
        
        <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1"><label htmlFor="filtroPaciente" className="block text-sm font-medium text-slate-700 mb-1.5">Paciente</label><input id="filtroPaciente" type="text" name="paciente" value={filtros.paciente} onChange={handleFiltroChange} placeholder="Filtrar por paciente..." className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"/></div>
            <div className="flex-1"><label htmlFor="filtroProfissional" className="block text-sm font-medium text-slate-700 mb-1.5">Profissional</label><input id="filtroProfissional" type="text" name="profissional" value={filtros.profissional} onChange={handleFiltroChange} placeholder="Filtrar por profissional..." className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"/></div>
            <div className="flex-1"><label htmlFor="filtroTipo" className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Atestado</label><input id="filtroTipo" type="text" name="tipo" value={filtros.tipo} onChange={handleFiltroChange} placeholder="Filtrar por tipo..." className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"/></div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {tableHeaders.map(header => ( <TableHeader key={header.field} {...header} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /> ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {isLoading ? ( <tr><td colSpan={tableHeaders.length + 1} className="p-4 text-center text-gray-500">Carregando...</td></tr> ) 
                : currentAtestados.length === 0 ? ( <tr><td colSpan={tableHeaders.length + 1} className="p-4 text-center text-gray-500">Nenhum atestado encontrado.</td></tr>) 
                : ( currentAtestados.map((atestado) => (
                      <tr key={atestado.idAtestado} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-600">{moment(atestado.dataEmissao).format("DD/MM/YYYY")}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-700">{`${atestado.paciente.nome} ${atestado.paciente.sobrenome}`}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{atestado.profissional.nome}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{atestado.tipoAtestado}</td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button onClick={() => openDetailsModal(atestado)} className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="Visualizar Detalhes">
                                <Eye size={15} />
                            </button>
                            <button onClick={() => handleDownload(atestado)} className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="Baixar PDF">
                                <Download size={15} />
                            </button>
                          </td>
                      </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>
        
        {atestadosProcessados.length > itemsPerPage && (
            <div className="mt-6">
                <Pagination totalItems={atestadosProcessados.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
        )}
        
        <ModalAddAtestado isOpen={isAddModalOpen} onClose={closeAllModals} onSave={handleSave} isSaving={isSaving} pacientes={pacientes} dadosAtestado={dadosAtestado} setDadosAtestado={setDadosAtestado} />
        <ModalDetalhesAtestado isOpen={isDetailsModalOpen} onClose={closeAllModals} atestado={selectedAtestado} />
        {/* ModalViewAtestados foi removido pois a tabela principal agora tem todas as funcionalidades */}
      </section>
    </div>
  );
};

export default GerarAtestados;