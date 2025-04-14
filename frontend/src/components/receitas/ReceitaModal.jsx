import React, { useState } from "react";
import ReceitaForm from "./receitaForm";
import MedicamentoSelectModal from "./MedicamentoSelectModal";

const ReceitaModal = ({ isOpen, onClose, pacientes, medicamentos, onAddReceita }) => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [medicamentosSelecionados, setMedicamentosSelecionados] = useState([]);
  const [dosagem, setDosagem] = useState("");
  const [instrucaoUso, setInstrucaoUso] = useState("");
  const [isMedicamentoModalOpen, setIsMedicamentoModalOpen] = useState(false);

  const handlePacienteChange = (event) => {
    setPacienteSelecionado(event.target.value);
  };

  const handleAddMedicamento = (medicamento) => {
    setMedicamentosSelecionados((prev) => [...prev, medicamento]);
  };

  const handleRemoveMedicamento = (index) => {
    const updated = [...medicamentosSelecionados];
    updated.splice(index, 1);
    setMedicamentosSelecionados(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const paciente = pacientes.find((p) => p.cpf === pacienteSelecionado);
    onAddReceita({
      cpfPaciente: pacienteSelecionado,
      pacienteNome: paciente ? `${paciente.nome} ${paciente.sobrenome}` : "",
      matriculaProfissional,
      medicamentos: medicamentosSelecionados,
      dosagem,
      instrucaoUso,
    });

    setPacienteSelecionado("");
    setMatriculaProfissional("");
    setMedicamentosSelecionados([]);
    setDosagem("");
    setInstrucaoUso("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h3 className="text-xl font-semibold mb-4">Nova Receita</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Paciente:</label>
            <select
              value={pacienteSelecionado}
              onChange={handlePacienteChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o Paciente</option>
              {pacientes.map((pac) => (
                <option key={pac.cpf} value={pac.cpf}>
                  {pac.nome} {pac.sobrenome} (CPF: {pac.cpf})
                </option>
              ))}
            </select>
          </div>

          <ReceitaForm onMatriculaChange={setMatriculaProfissional} />

          <div>
            <label className="block text-sm font-medium mb-1">Medicamentos Selecionados:</label>
            {medicamentosSelecionados.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum medicamento adicionado.</p>
            ) : (
              <ul className="space-y-2">
                {medicamentosSelecionados.map((med, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-blue-50 rounded"
                  >
                    <span>{med.nomeMedicamento}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicamento(index)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setIsMedicamentoModalOpen(true)}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              + Adicionar medicamento
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dosagem:</label>
            <textarea
              value={dosagem}
              onChange={(e) => setDosagem(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instrução de Uso:</label>
            <textarea
              value={instrucaoUso}
              onChange={(e) => setInstrucaoUso(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              Salvar Receita
            </button>
          </div>
        </form>

        <MedicamentoSelectModal
          isOpen={isMedicamentoModalOpen}
          onClose={() => setIsMedicamentoModalOpen(false)}
          medicamentos={medicamentos}
          onAddMedicamento={handleAddMedicamento}
        />
      </div>
    </div>
  );
};

export default ReceitaModal;