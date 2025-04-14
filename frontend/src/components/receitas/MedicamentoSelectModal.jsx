import React, { useState } from "react";

const MedicamentoSelectModal = ({ isOpen, onClose, medicamentos, onAddMedicamento }) => {
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState("");

  const handleMedicamentoChange = (event) => {
    setMedicamentoSelecionado(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const medicamento = medicamentos.find(
      (med) => med.idMedicamento == medicamentoSelecionado
    );
    if (medicamento) {
      onAddMedicamento({
        idMedicamento: medicamento.idMedicamento,
        nomeMedicamento: medicamento.nomeMedicamento,
        controlado: medicamento.controlado,
        interacao: medicamento.interacao,
      });
    }
    setMedicamentoSelecionado("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Adicionar Medicamento</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Medicamento:</label>
            <select
              value={medicamentoSelecionado}
              onChange={handleMedicamentoChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o Medicamento</option>
              {medicamentos.map((medicamento) => (
                <option
                  key={medicamento.idMedicamento}
                  value={medicamento.idMedicamento}
                >
                  {medicamento.nomeMedicamento}
                </option>
              ))}
            </select>
          </div>

          {medicamentoSelecionado && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Controlado:</label>
                <input
                  type="text"
                  value={
                    medicamentos.find((med) => med.idMedicamento == medicamentoSelecionado)
                      ?.controlado || ""
                  }
                  
                  className="w-full p-2 border bg-gray-100 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Interação Medicamentosa:
                </label>
                <input
                  type="text"
                  value={
                    medicamentos.find((med) => med.idMedicamento == medicamentoSelecionado)
                      ?.interacao || ""
                  }
                  className="w-full p-2 border bg-gray-100 rounded"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicamentoSelectModal;