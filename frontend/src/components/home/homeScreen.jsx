import React from "react";

const HomeScreen = () => {
  // Simulação de papel do usuário (pode vir do useAuthContext)
  const userRole = "Atendente";

  // Links rápidos baseados no papel do usuário
  const quickLinks = {
    Atendente: [
      { title: "Pacientes", path: "/pacientes" },
      { title: "Solicitação de Exames", path: "/solicitacaoExames" },
      { title: "Tipos de Consultas", path: "/tipoConsulta" },
    ],
    Médico: [
      { title: "Pacientes", path: "/pacientes" },
      { title: "Emitir Receitas", path: "/emitir-receitas" },
      { title: "Registrar Resultados Exames", path: "/registrar-resultados-exames" },
    ],
    Diretor: [
      { title: "Profissionais", path: "/profissionais" },
      { title: "Pacientes", path: "/pacientes" },
      { title: "Planos de Saúde", path: "/planoDeSaude" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        {/* Cabeçalho */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo ao MedAgenda
          </h1>
          <p className="text-lg text-gray-600">
            Organize e gerencie o atendimento médico com eficiência.
          </p>
        </header>

        {/* Links Rápidos */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ações Rápidas
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {quickLinks[userRole].map((link, index) => (
              <a
                key={index}
                href={link.path}
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-all duration-150 no-underline"
              >
                {link.title}
              </a>
            ))}
          </div>
        </section>

        {/* Recursos Úteis */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recursos Úteis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Cadastros Essenciais
              </h3>
              <p className="text-gray-600">
                Gerencie pacientes, profissionais e planos de saúde em poucos cliques para manter tudo atualizado.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Documentação Rápida
              </h3>
              <p className="text-gray-600">
                Emita receitas, atestados e solicitações de exames diretamente no sistema.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Organização Simplificada
              </h3>
              <p className="text-gray-600">
                Classifique consultas e exames por tipo para facilitar o controle diário.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Suporte ao Atendimento
              </h3>
              <p className="text-gray-600">
                Acesse ferramentas que ajudam no planejamento e execução do cuidado ao paciente.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeScreen;