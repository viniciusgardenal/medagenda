import React from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, FileText } from "lucide-react";
import { useAuthContext } from "../../context/authContext";

const HomeScreen = () => {
  const { user } = useAuthContext();

  // Filtra as opções de acesso rápido conforme a role do usuário
  const quickLinks = [
    { label: "Profissionais", to: "/profissionais", roles: ["Diretor"] },
    { label: "Pacientes", to: "/pacientes", roles: ["Diretor", "Atendente"] },
    { label: "Medicamentos", to: "/medicamentos", roles: ["Diretor", "Médico"] },
    { label: "Tipos de Exames", to: "/tiposExames", roles: ["Diretor", "Médico"] },
    { label: "Planos de Saúde", to: "/planoDeSaude", roles: ["Diretor"] },
    { label: "Consultas", to: "/consultas", roles: ["Diretor", "Médico", "Atendente"] },
  ].filter((link) => !user || link.roles.includes(user.role));

  // Ajusta a quantidade de colunas no grid conforme o número de itens disponíveis
  const getGridClass = () => {
    switch (quickLinks.length) {
      case 1:
        return "grid-cols-1 max-w-xs mx-auto";
      case 2:
        return "grid-cols-2 max-w-md mx-auto";
      case 3:
        return "grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto";
      case 4:
        return "grid-cols-2 max-w-2xl mx-auto";
      default:
        return "grid-cols-2 md:grid-cols-3";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col transition-colors duration-150">
      {/* Cabeçalho */}
      <header className="bg-blue-900 dark:bg-gray-950 text-white py-16 px-6 flex items-center justify-center transition-colors duration-150">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-semibold mb-4">MedAgenda</h1>
          <p className="text-lg font-light text-blue-100 dark:text-gray-300">
            Sistema de gerenciamento médico-administrativo para otimizar processos e melhorar o atendimento ao paciente.
          </p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6">
        {/* Links Rápidos */}
        <section className="w-full max-w-4xl mb-12">
          <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6 text-center">
            Acesso Rápido
          </h2>
          <div className={`grid gap-4 ${getGridClass()}`}>
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-md text-center text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 no-underline block shadow-sm hover:shadow"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Benefícios */}
        <section className="w-full max-w-5xl">
          <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6 text-center">
            Benefícios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
              <Users size={24} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Gestão de Equipe
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize profissionais e suas agendas com facilidade.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
              <Calendar size={24} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Agendamento Simples
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Programe consultas de forma rápida e eficiente.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
              <FileText size={24} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Controle de Documentos
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie exames e prescrições em um só lugar.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-blue-900 dark:bg-gray-950 text-white py-6 text-center text-sm transition-colors duration-150">
        <p>MedAgenda © 2025 - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default HomeScreen;