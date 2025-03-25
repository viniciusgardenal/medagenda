import React, { useState } from "react";
import { Home, Users, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useAuthContext } from "../../context/authContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [basicOpen, setBasicOpen] = useState(false);
  const [fundamentalOpen, setFundamentalOpen] = useState(false);
  const { user, logout } = useAuthContext();

  const menuItems = [
    {
      title: "HOME",
      icon: "home",
      path: "/home",
      roles: ["Diretor", "Atendente", "Médico"],
    },
    {
      title: "FUNÇÕES BÁSICAS",
      roles: ["Diretor", "Atendente", "Médico"],
      isDropdown: true,
      items: [
        {
          title: "Profissionais",
          path: "/profissionais",
          icon: "professionals",
          roles: ["Diretor"],
        },
        {
          title: "Pacientes",
          path: "/pacientes",
          icon: "users",
          roles: ["Diretor", "Atendente"],
        },
        {
          title: "Medicamentos",
          path: "/medicamentos",
          icon: "medications",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Tipos de Exames",
          path: "/tiposExames",
          icon: "examTypes",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Tipos de Consultas",
          path: "/tipoConsulta",
          icon: "consultationTypes",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Planos de Saúde",
          path: "/planoDeSaude",
          icon: "healthPlans",
          roles: ["Diretor"],
        },
      ],
    },
    {
      title: "FUNÇÕES FUNDAMENTAIS",
      roles: ["Diretor", "Atendente", "Médico"],
      isDropdown: true,
      items: [
        {
          title: "Solicitação de Exames",
          path: "/solicitacaoExames",
          icon: "examRequest",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Emitir Receitas",
          path: "/emitir-receitas",
          icon: "prescriptions",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Emitir Atestados",
          path: "/emitir-atestados",
          icon: "certificates",
          roles: ["Diretor", "Médico"],
        },
        {
          title: "Registrar Resultados Exames",
          path: "/registrar-resultados-exames",
          icon: "examResults",
          roles: ["Diretor", "Médico"],
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .map((item) => {
      if (item.isDropdown) {
        return {
          ...item,
          items: item.items.filter((subItem) =>
            subItem.roles.includes(user?.role)
          ),
        };
      }
      return item;
    })
    .filter(
      (item) =>
        item.roles.includes(user?.role) && (!item.isDropdown || item.items.length > 0)
    );

  const renderIcon = (iconKey) => {
    switch (iconKey) {
      case "home":
        return <Home size={20} />;
      case "users":
        return <Users size={20} />;
      case "professionals":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
        );
      case "medications":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
            />
          </svg>
        );
      case "examTypes":
      case "consultationTypes":
      case "examRequest":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
        );
      case "healthPlans":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
            />
          </svg>
        );
      case "prescriptions":
      case "certificates":
      case "examResults":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-600 text-white shadow-md hover:bg-gray-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-white to-gray-100 text-gray-800 shadow-lg transition-all duration-300 ease-in-out
          ${isOpen ? "w-72" : "w-0 lg:w-72"}
          ${isOpen ? "overflow-visible" : "overflow-hidden"}
          lg:relative lg:block
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-center h-20 bg-white border-b border-gray-200">
          <span
            className={`font-semibold text-2xl tracking-wide text-blue-600 ${
              !isOpen && "hidden lg:block"
            }`}
          >
            MedAgenda
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item, index) => (
              <li key={index}>
                {item.isDropdown ? (
                  <div>
                    <button
                      onClick={() =>
                        item.title === "FUNÇÕES BÁSICAS"
                          ? setBasicOpen(!basicOpen)
                          : setFundamentalOpen(!fundamentalOpen)
                      }
                      className={`flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-800 ${
                        !isOpen && "justify-center"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold uppercase text-gray-500 ${
                          !isOpen && "hidden lg:inline"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className={`${!isOpen && "hidden lg:inline"}`}>
                        {item.title === "FUNÇÕES BÁSICAS" ? (
                          basicOpen ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )
                        ) : fundamentalOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    </button>
                    {(item.title === "FUNÇÕES BÁSICAS" ? basicOpen : fundamentalOpen) && (
                      <ul className="pl-4 space-y-1 mt-1">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href={subItem.path}
                              className={`flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-800 no-underline ${
                                !isOpen && "justify-center"
                              }`}
                            >
                              <span className="text-blue-600">{renderIcon(subItem.icon)}</span>
                              <span
                                className={`ml-3 text-sm font-medium ${
                                  !isOpen && "hidden lg:inline"
                                }`}
                              >
                                {subItem.title}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.path}
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-800 no-underline ${
                      !isOpen && "justify-center"
                    }`}
                  >
                    <span className="text-blue-600">{renderIcon(item.icon)}</span>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        !isOpen && "hidden lg:inline"
                      }`}
                    >
                      {item.title === "HOME" ? <strong>{item.title}</strong> : item.title}
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div
          className={`absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white ${
            !isOpen && "lg:p-2"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 ${
                !isOpen && "hidden lg:flex"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            {isOpen && (
              <button
                className="flex items-center text-red-500 hover:text-red-600 transition duration-150 space-x-1"
                onClick={logout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1m10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L14.586 9H7a1 1 0 0 0 0 2h7.586z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Sair</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;