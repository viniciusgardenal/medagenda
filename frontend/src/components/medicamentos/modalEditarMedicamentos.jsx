import React, { useState } from "react";
import { X } from "lucide-react";
import { RegrasMedicamento } from "./regrasValidacao";
import { updateMedicamentos } from "../../config/apiServices";

const ModalEditarMedicamento = ({
  isOpen,
  onClose,
  medicamentos,
  onUpdate,
}) => {
  const [nomeMedicamento, setNomeMedicamento] = useState(
    medicamentos?.nomeMedicamento || ""
  );
  const [controlado, setControlado] = useState(
    medicamentos?.controlado === "Medicamento Controlado"
      ? "Sim"
      : medicamentos?.controlado === "Medicamento Não Controlado"
      ? "Não"
      : medicamentos?.controlado || ""
  );
  const [nomeFabricante, setNomeFabricante] = useState(
    medicamentos?.nomeFabricante || ""
  );
  const [descricao, setDescricao] = useState(medicamentos?.descricao || "");
  const [instrucaoUso, setInstrucaoUso] = useState(
    medicamentos?.instrucaoUso || ""
  );
  const [interacao, setInteracao] = useState(medicamentos?.interacao || "");
  const [erros, setErros] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validarCampos = () => {
    const newErros = {};
    Object.keys(RegrasMedicamento).forEach((campo) => {
      RegrasMedicamento[campo].forEach((regra) => {
        const valorCampo = eval(campo);
        if (!regra.regra(valorCampo)) {
          newErros[campo] = regra.mensagem;
        }
      });
    });
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    const dadosAtualizados = {
      nomeMedicamento,
      controlado:
        controlado === "Sim"
          ? "Medicamento Controlado"
          : "Medicamento Não Controlado",
      nomeFabricante,
      descricao,
      instrucaoUso,
      interacao,
    };

    try {
      setIsLoading(true);
      await updateMedicamentos(medicamentos.idMedicamento, dadosAtualizados);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar medicamento:", error);
      setErros({ general: "Erro ao atualizar medicamento. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !medicamentos) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Editar Medicamento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Medicamento e Fabricante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Medicamento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nomeMedicamento}
                onChange={(e) => setNomeMedicamento(e.target.value)}
                placeholder="Ex: Paracetamol"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {erros.nomeMedicamento && (
                <span className="text-red-500 text-xs mt-1">
                  {erros.nomeMedicamento}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fabricante
              </label>
              <input
                type="text"
                value={nomeFabricante}
                onChange={(e) => setNomeFabricante(e.target.value)}
                placeholder="Ex: EMS"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {erros.nomeFabricante && (
                <span className="text-red-500 text-xs mt-1">
                  {erros.nomeFabricante}
                </span>
              )}
            </div>
          </div>

          {/* Controlado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Controlado <span className="text-red-500">*</span>
            </label>
            <select
              value={controlado}
              onChange={(e) => setControlado(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
            {erros.controlado && (
              <span className="text-red-500 text-xs mt-1">
                {erros.controlado}
              </span>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite detalhes do medicamento..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
            />
            {erros.descricao && (
              <span className="text-red-500 text-xs mt-1">
                {erros.descricao}
              </span>
            )}
          </div>

          {/* Instrução de Uso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrução de Uso
            </label>
            <textarea
              value={instrucaoUso}
              onChange={(e) => setInstrucaoUso(e.target.value)}
              placeholder="Ex: Tomar 1 comprimido a cada 8 horas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
            />
            {erros.instrucaoUso && (
              <span className="text-red-500 text-xs mt-1">
                {erros.instrucaoUso}
              </span>
            )}
          </div>

          {/* Interações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interações Medicamentosas
            </label>
            <textarea
              value={interacao}
              onChange={(e) => setInteracao(e.target.value)}
              placeholder="Ex: Evitar uso com álcool"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
            />
            {erros.interacao && (
              <span className="text-red-500 text-xs mt-1">
                {erros.interacao}
              </span>
            )}
          </div>

          {/* Erro Geral */}
          {erros.general && (
            <p className="text-red-500 text-sm">{erros.general}</p>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm disabled:bg-blue-400"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarMedicamento;
