import React, { useState } from "react";
import { Home, Users, Menu, X, ChevronDown, User } from "lucide-react";
import { useAuthContext } from "../../context/authContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { user, logout } = useAuthContext();
  // console.log(user);

  const menuItems = [
    {
      title: "Home",
      icon: <Home size={18} />,
      path: "/home",
      roles: ["Diretor", "Atendente", "Médico"],
    },
    {
      title: "Funções Básicas",
      icon: <Home size={18} />,
      items: [
        {
          title: "Profissionais",
          path: "/profissionais",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          ),
          roles: ["Diretor"],
        },
        {
          title: "Pacientes",
          path: "/pacientes",
          icon: <Users size={18} />,
          roles: ["Diretor", "Atendente"],
        },
        {
          title: "Medicamentos",
          path: "/medicamentos",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
              />
            </svg>
          ),
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Tipos de Exames",
          path: "/tiposExames",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          ),
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Tipos de Consultas",
          path: "/tipoConsulta",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          ),
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Planos de Saúde",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
          ),
          path: "/planoDeSaude",
          roles: ["Diretor"],
        },
      ],
      roles: ["Diretor", "Atendente", "Médico"],
    },
    {
      title: "Funções Fundamentais",
      icon: <Users size={18} />,
      items: [
        {
          title: "Solicitação de Exames",
          path: "/solicitacaoExames",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          ),
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Emitir Receitas",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          ),
          path: "/emitir-receitas",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Emitir Atestados",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          ),
          path: "/emitir-atestados",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Registrar Resultados",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          ),
          path: "/registrar-resultados-exames",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Check-in de Pacientes",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          ),
          path: "/checkin-pacientes",
          roles: ["Diretor", "Médico", "Atendente"],
        },
        {
          title: "Gerenciar Horários de Profissionais",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          ),
          path: "/horarios-profissionais",
          roles: ["Diretor"],
        },
        {
          title: "Agendar Consultas",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          ),
          path: "/consultas",
          roles: ["Diretor", "Médico", "Atendente"],
        },
      ],
      roles: ["Diretor", "Atendente", "Médico"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="relative min-h-screen">
      {/* Botão de menu mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-150"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white text-gray-700 transition-all duration-300 ease-in-out border-r border-gray-100 ${
          isOpen ? "w-64" : "w-0 lg:w-64"
        } lg:relative lg:block`}
      >
        {/* Área do Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <span
              className={`text-xl font-semibold text-gray-800 ${
                !isOpen && "hidden lg:block"
              }`}
            >
              MedAgenda
            </span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((section, index) => (
            <div key={index} className="mb-2">
              {section.path ? (
                <a
                  href={section.path}
                  className="w-full flex items-center no-underline px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors duration-150"
                >
                  <span className="text-blue-500">{section.icon}</span>
                  <span className="text-sm font-medium text-gray-700 ml-2">
                    {section.title}
                  </span>
                </a>
              ) : (
                <>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full flex items-center no-underline justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">{section.icon}</span>
                      <span className="text-sm font-medium text-gray-700 text-left">
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-150 ${
                        openDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === index && (
                    <ul className="mt-1 space-y-1 pl-6">
                      {section.items
                        .filter((item) => item.roles.includes(user?.role))
                        .map((item, idx) => (
                          <li key={idx}>
                            <a
                              href={item.path}
                              className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors duration-150 no-underline"
                            >
                              <span className="mr-2 text-gray-400">
                                {item.icon}
                              </span>
                              <span className="text-sm">{item.title}</span>
                            </a>
                          </li>
                        ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Rodapé com Perfil do Usuário */}
        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
            {isOpen && (
              <div className="flex items-center space-x-2">
                <User size={18} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {user?.nome || "Usuário"}
                </span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-150 space-x-1"
            >
              <span className="text-sm">Sair</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                className="fill-current"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1m10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 0 0-1.414 1.414L14.586 9H7a1 1 0 0 0 0 2h7.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
