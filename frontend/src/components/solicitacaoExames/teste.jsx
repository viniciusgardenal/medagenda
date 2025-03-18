const ModalSolicitacaoExames = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    paciente: '',
    tipoExame: '',
    justificativa: '',
    periodo: '',
    dataRetorno: ''
  });

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-green-50 border-b border-green-100">
          <h2 className="text-lg font-semibold text-green-800">
            Nova Solicitação de Exame - Etapa {currentStep}/3
          </h2>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  step <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <form className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-700">
                  Selecione o Paciente
                </h3>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">
                    Paciente:
                  </label>
                  <select
                    value={formData.paciente}
                    onChange={(e) => 
                      setFormData({...formData, paciente: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione um paciente</option>
                    {/* Opções de pacientes */}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-700">
                  Informações do Exame
                </h3>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">
                    Tipo de Exame:
                  </label>
                  <select
                    value={formData.tipoExame}
                    onChange={(e) => 
                      setFormData({...formData, tipoExame: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione o tipo de exame</option>
                    {/* Opções de exames */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">
                    Justificativa:
                  </label>
                  <textarea
                    value={formData.justificativa}
                    onChange={(e) => 
                      setFormData({...formData, justificativa: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500 min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-700">
                  Agendamento
                </h3>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">
                    Período:
                  </label>
                  <select
                    value={formData.periodo}
                    onChange={(e) => 
                      setFormData({...formData, periodo: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione o período</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">
                    Data de Retorno:
                  </label>
                  <input
                    type="date"
                    value={formData.dataRetorno}
                    onChange={(e) => 
                      setFormData({...formData, dataRetorno: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Botões de navegação */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
          >
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </button>
          <button
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            {currentStep === 3 ? 'Finalizar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};