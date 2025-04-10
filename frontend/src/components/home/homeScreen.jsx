import React from "react";
import { Users, Calendar, FileText } from "lucide-react";

const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-blue-900 text-white py-16 px-6 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-semibold mb-4">MedAgenda</h1>
          <p className="text-lg font-light">
            Sistema de gerenciamento médico-administrativo para otimizar processos e melhorar o atendimento ao paciente.
          </p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6">
        {/* Links Rápidos */}
        <section className="w-full max-w-4xl mb-12">
          <h2 className="text-2xl font-medium text-gray-700 mb-6 text-center">Acesso Rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Profissionais", href: "#" },
              { label: "Pacientes", href: "#" },
              { label: "Medicamentos", href: "#" },
              { label: "Tipos de Exames", href: "#" },
              { label: "Planos de Saúde", href: "#" },
              { label: "Consultas", href: "#" },
            ].map((link, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-md text-center text-sm font-medium"
              >
                {link.label}
              </div>
            ))}
          </div>
        </section>

        {/* Benefícios */}
        <section className="w-full max-w-5xl">
          <h2 className="text-2xl font-medium text-gray-700 mb-6 text-center">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <Users size={24} className="text-blue-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Gestão de Equipe</h3>
                <p className="text-sm text-gray-600">
                  Organize profissionais e suas agendas com facilidade.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <Calendar size={24} className="text-blue-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Agendamento Simples</h3>
                <p className="text-sm text-gray-600">
                  Programe consultas de forma rápida e eficiente.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <FileText size={24} className="text-blue-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Controle de Documentos</h3>
                <p className="text-sm text-gray-600">
                  Gerencie exames e prescrições em um só lugar.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-blue-900 text-white py-4 text-center text-sm">
        <p>MedAgenda © 2025 - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default HomeScreen;