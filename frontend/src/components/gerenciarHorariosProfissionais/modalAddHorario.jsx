import React, { useState, useMemo } from "react";

const ModalAddHorario = ({
  isOpen,
  onClose,
  dadosHorario,
  setDadosHorario,
  onSave,
  isSaving,
  profissionais,
  horarios, // Nova propriedade recebida
}) => {
  const [selecionarTodos, setSelecionarTodos] = useState(false);

  // useMemo para calcular eficientemente os dias já cadastrados para o profissional selecionado
  const diasJaCadastrados = useMemo(() => {
    if (!dadosHorario.matriculaProfissional || !horarios) {
      return [];
    }
    // Filtra os horários para encontrar os do profissional selecionado e retorna um array com os dias.
    return horarios
      .filter(h => h.matriculaProfissional.toString() === dadosHorario.matriculaProfissional)
      .map(h => h.diaSemana);
  }, [dadosHorario.matriculaProfissional, horarios]);

  if (!isOpen) return null;

  const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const handleCheckboxChange = (dia) => {
    setDadosHorario((prev) => {
      const novosDias = prev.diaSemana.includes(dia)
        ? prev.diaSemana.filter((d) => d !== dia)
        : [...prev.diaSemana, dia];
      return { ...prev, diaSemana: novosDias };
    });
    setSelecionarTodos(false);
  };

  const handleSelecionarTodos = () => {
    const novoEstado = !selecionarTodos;
    setSelecionarTodos(novoEstado);
    // Ao selecionar todos, filtra para incluir apenas os dias que NÃO estão cadastrados
    const diasDisponiveis = diasSemana.filter(dia => !diasJaCadastrados.includes(dia));
    setDadosHorario((prev) => ({
      ...prev,
      diaSemana: novoEstado ? diasDisponiveis : [],
    }));
  };
  
  // Handler para o select de profissional
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Se o profissional for alterado, reseta a seleção de dias
    if (name === "matriculaProfissional") {
        setDadosHorario((prev) => ({ 
            ...prev, 
            diaSemana: [],
            [name]: value 
        }));
        setSelecionarTodos(false); // Reseta o checkbox "Selecionar Todos"
    } else {
        setDadosHorario((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // A validação agora ocorre na UI, mas mantemos uma verificação de segurança
    if (dadosHorario.diaSemana.length === 0) {
      alert("Selecione pelo menos um dia da semana disponível.");
      return;
    }
    if (!dadosHorario.matriculaProfissional) {
      alert("Selecione um profissional.");
      return;
    }
    // ... (resto da lógica de validação de horário)
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" disabled={isSaving}>
          {/* ... SVG Icon ... */}
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-6">Novo Horário</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Profissional</label>
            <select
              name="matriculaProfissional"
              value={dadosHorario.matriculaProfissional}
              onChange={handleChange} // Usa o novo handler
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm"
              required
              disabled={isSaving}
            >
              <option value="">Selecione um profissional</option>
              {profissionais?.map((prof) => (
                  <option key={prof.matricula} value={prof.matricula.toString()}>
                    {`${prof.nome} ${prof.sobrenome || ""} (Matrícula: ${prof.matricula})`}
                  </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-1 space-y-4">
                {/* Inputs de Horário */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Horário Início</label>
                    <input type="time" name="inicio" value={dadosHorario.inicio} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required disabled={isSaving}/>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Horário Fim</label>
                    <input type="time" name="fim" value={dadosHorario.fim} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required disabled={isSaving}/>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Início do Intervalo (opcional)</label>
                    <input type="time" name="intervaloInicio" value={dadosHorario.intervaloInicio || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={isSaving} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fim do Intervalo (opcional)</label>
                    <input type="time" name="intervaloFim" value={dadosHorario.intervaloFim || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={isSaving} />
                </div>
            </div>
            <div className="col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dias da Semana</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={selecionarTodos} onChange={handleSelecionarTodos} className="h-4 w-4 text-blue-600 rounded" disabled={isSaving} />
                    <span className="text-sm text-gray-700">Selecionar Todos (Disponíveis)</span>
                  </label>
                  <hr/>
                  {diasSemana.map((dia) => {
                    const isCadastrado = diasJaCadastrados.includes(dia);
                    return (
                        <label key={dia} className={`flex items-center space-x-2 ${isCadastrado ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input
                                type="checkbox"
                                checked={dadosHorario.diaSemana.includes(dia)}
                                onChange={() => handleCheckboxChange(dia)}
                                className="h-4 w-4 text-blue-600 rounded"
                                disabled={isSaving || isCadastrado} // Desabilita se já cadastrado
                            />
                            <span className={`text-sm ${isCadastrado ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                {dia}
                            </span>
                        </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md" disabled={isSaving}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddHorario;