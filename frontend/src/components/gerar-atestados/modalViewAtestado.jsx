import React, { useState, useMemo } from "react";
import { FaDownload, FaSearch, FaTimesCircle, FaEye } from "react-icons/fa";
import TableHeader from './TableHeader';
import Pagination from '../util/Pagination';
import moment from 'moment'; // <-- ADICIONADO AQUI
import ModalDetalhesAtestado from "./modalDetalhesAtestado"; // <-- ADICIONADO AQUI

const ModalViewAtestados = ({ isOpen, onClose, atestados, onDownload }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState('dataEmissao');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAtestado, setSelectedAtestado] = useState(null);

  const openDetailsModal = (atestado) => {
    setSelectedAtestado(atestado);
    setIsDetailsModalOpen(true);
  };
  
  const closeDetailsModal = () => setIsDetailsModalOpen(false);

  const filteredAndSortedAtestados = useMemo(() => {
    let result = [...atestados];
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(atestado => 
        atestado.paciente?.nome.toLowerCase().includes(lowercasedTerm) ||
        atestado.paciente?.sobrenome.toLowerCase().includes(lowercasedTerm) ||
        atestado.profissional?.nome.toLowerCase().includes(lowercasedTerm) ||
        atestado.tipoAtestado.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    result.sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';
        const direction = sortDirection === 'asc' ? 1 : -1;
        
        if (sortField === 'dataEmissao') {
            return (moment(valA).valueOf() - moment(valB).valueOf()) * direction;
        }

        return String(valA).localeCompare(String(valB)) * direction;
    });

    return result;
  }, [atestados, searchTerm, sortField, sortDirection]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedAtestados.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-50 w-full max-w-6xl h-[90vh] p-6 rounded-xl shadow-2xl flex flex-col">
          <header className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">Histórico de Atestados</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimesCircle className="h-7 w-7" /></button>
          </header>
          
          <div className="py-4"><div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><FaSearch className="h-5 w-5 text-gray-400" /></div>
            <input type="text" placeholder="Buscar por paciente, profissional ou tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div></div>

          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-blue-600 text-white sticky top-0"><tr>
              <TableHeader label="Data" field="dataEmissao" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader label="Paciente" field="paciente.nome" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader label="Profissional" field="profissional.nome" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Ações</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">{currentItems.map((atestado) => (
                <tr key={atestado.idAtestado} className="hover:bg-blue-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{moment(atestado.dataEmissao).format("DD/MM/YYYY")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{atestado.paciente?.nome || "N/A"} {atestado.paciente?.sobrenome || ""}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{atestado.profissional?.nome || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2.5 py-0.5 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{atestado.tipoAtestado}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center gap-4">
                      <button onClick={() => openDetailsModal(atestado)} className="text-gray-500 hover:text-blue-600" title="Visualizar Detalhes"><FaEye className="h-5 w-5"/></button>
                      <button onClick={() => onDownload(atestado)} className="text-gray-500 hover:text-blue-600" title="Baixar PDF">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </td>
                </tr>
            ))}</tbody></table>
          </div>
          <div className="pt-4 mt-auto border-t border-gray-200">
            <Pagination totalItems={filteredAndSortedAtestados.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
      <ModalDetalhesAtestado isOpen={isDetailsModalOpen} onClose={closeDetailsModal} atestado={selectedAtestado} />
    </>
  );
};

export default ModalViewAtestados;