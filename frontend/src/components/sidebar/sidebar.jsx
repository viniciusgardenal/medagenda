import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, Users, Menu, X, ChevronDown, User, Sun, Moon,
  Stethoscope, Pill, FlaskConical, ClipboardList, CreditCard,
  ClipboardCheck, FileText, FileBadge, FlaskRound, CalendarCheck,
  Clock, Calendar, Activity, Skull
} from "lucide-react";
import { useAuthContext } from "../../context/authContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const { user, logout } = useAuthContext();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  const menuItems = [
    {
      title: "Home",
      icon: <Home size={16} />,
      path: "/home",
      roles: ["Diretor", "Atendente", "Médico"],
    },
    {
      title: "Funções Básicas",
      icon: <ClipboardList size={16} />,
      items: [
        { title: "Profissionais", path: "/profissionais", icon: <Stethoscope size={15} />, roles: ["Diretor"] },
        { title: "Pacientes", path: "/pacientes", icon: <Users size={15} />, roles: ["Diretor", "Atendente"] },
        { title: "Medicamentos", path: "/medicamentos", icon: <Pill size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Tipos de Exames", path: "/tiposExames", icon: <FlaskConical size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Tipos de Consultas", path: "/tipoConsulta", icon: <ClipboardList size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Planos de Saúde", path: "/planoDeSaude", icon: <CreditCard size={15} />, roles: ["Diretor"] },
      ],
      roles: ["Diretor", "Atendente", "Médico"],
    },
    {
      title: "Funções Fundamentais",
      icon: <Activity size={16} />,
      items: [
        { title: "Agendar Consultas", path: "/consultas", icon: <Calendar size={15} />, roles: ["Diretor", "Médico", "Atendente"] },
        { title: "Check-in de Pacientes", path: "/checkin-pacientes", icon: <ClipboardCheck size={15} />, roles: ["Diretor", "Médico", "Atendente"] },
        { title: "Registrar Atendimentos", path: "/atendimentos", icon: <Activity size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Gerenciar Horários", path: "/horarios-profissionais", icon: <Clock size={15} />, roles: ["Diretor"] },
        { title: "Solicitação de Exames", path: "/solicitacaoExames", icon: <FlaskRound size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Registrar Resultados", path: "/registrar-resultados-exames", icon: <CalendarCheck size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Emitir Receitas", path: "/emitir-receitas", icon: <FileText size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Emitir Atestados", path: "/emitir-atestados", icon: <FileBadge size={15} />, roles: ["Diretor", "Médico"] },
        { title: "Registrar Óbitos", path: "/registro-obitos", icon: <Skull size={15} />, roles: ["Diretor", "Médico", "Atendente"] },
      ],
      roles: ["Diretor", "Atendente", "Médico"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role));

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const isActive = (path) => location.pathname === path;

  const roleLabel = { Diretor: "Diretor", Médico: "Médico", Atendente: "Atendente" };

  return (
    <div className="relative min-h-screen">
      {/* Botão mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-800 text-white hover:bg-slate-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "w-64" : "w-0 overflow-hidden lg:w-64"
        } lg:relative lg:block z-40 border-r border-slate-800`}
      >
        {/* Logo / Marca */}
        <div className="flex items-center px-5 h-16 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v4m0 0v4m0-4h4m-4 0H8" />
                <circle cx="12" cy="12" r="9" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="text-white font-semibold text-base tracking-tight">MedAgenda</span>
              <p className="text-slate-500 text-xs leading-none">Sistema de Saúde</p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {filteredMenuItems.map((section, index) => (
            <div key={index} className="mb-1">
              {section.path ? (
                <Link
                  to={section.path}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm no-underline transition-colors ${
                    isActive(section.path)
                      ? "bg-blue-700 text-white font-medium"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className={isActive(section.path) ? "text-white" : "text-slate-500"}>
                    {section.icon}
                  </span>
                  {section.title}
                </Link>
              ) : (
                <>
                  {/* Separador de seção */}
                  <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest px-3 pt-4 pb-1.5">
                    {section.title}
                  </p>

                  {section.items
                    .filter((item) => item.roles.includes(user?.role))
                    .map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm no-underline transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-700 text-white font-medium"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <span className={isActive(item.path) ? "text-blue-200" : "text-slate-600"}>
                          {item.icon}
                        </span>
                        {item.title}
                      </Link>
                    ))}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Rodapé de Perfil */}
        <div className="shrink-0 p-3 border-t border-slate-800">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md bg-slate-800/60">
            <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center shrink-0">
              <User size={14} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-300 text-sm font-medium truncate">{user?.nome || "Usuário"}</p>
              <p className="text-slate-600 text-xs">{roleLabel[user?.role] || user?.role}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors"
                title="Alternar tema"
              >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button
                onClick={logout}
                className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors"
                title="Sair"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" className="fill-current">
                  <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1m10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 0 0-1.414 1.414L14.586 9H7a1 1 0 0 0 0 2h7.586z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
