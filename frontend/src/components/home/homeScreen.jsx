import React from "react";
import { Link } from "react-router-dom";
import {
  Users, Calendar, FileText, Activity, Stethoscope,
  ClipboardList, Pill, FlaskConical, CreditCard, ClipboardCheck,
  FileBadge, Clock, CalendarCheck, FlaskRound, Skull
} from "lucide-react";
import { useAuthContext } from "../../context/authContext";

const quickLinksConfig = [
  { label: "Profissionais", to: "/profissionais", icon: Stethoscope, roles: ["Diretor"], desc: "Cadastro e gestão de profissionais" },
  { label: "Pacientes", to: "/pacientes", icon: Users, roles: ["Diretor", "Atendente"], desc: "Registro e histórico de pacientes" },
  { label: "Medicamentos", to: "/medicamentos", icon: Pill, roles: ["Diretor", "Médico"], desc: "Controle do estoque de medicamentos" },
  { label: "Tipos de Exames", to: "/tiposExames", icon: FlaskConical, roles: ["Diretor", "Médico"], desc: "Gerenciar categorias de exames" },
  { label: "Planos de Saúde", to: "/planoDeSaude", icon: CreditCard, roles: ["Diretor"], desc: "Convênios e planos cadastrados" },
  { label: "Consultas", to: "/consultas", icon: Calendar, roles: ["Diretor", "Médico", "Atendente"], desc: "Agendamento de consultas" },
  { label: "Check-in", to: "/checkin-pacientes", icon: ClipboardCheck, roles: ["Diretor", "Médico", "Atendente"], desc: "Chegada e triagem de pacientes" },
  { label: "Atendimentos", to: "/atendimentos", icon: Activity, roles: ["Diretor", "Médico"], desc: "Registrar atendimentos clínicos" },
  { label: "Receitas", to: "/emitir-receitas", icon: FileText, roles: ["Diretor", "Médico"], desc: "Emissão de prescrições médicas" },
  { label: "Atestados", to: "/emitir-atestados", icon: FileBadge, roles: ["Diretor", "Médico"], desc: "Geração de atestados médicos" },
];

const statConfig = [
  {
    icon: Users,
    label: "Gestão de Pacientes",
    desc: "Histórico completo, dados clínicos e agendamentos centralizados.",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    icon: Calendar,
    label: "Agenda Eficiente",
    desc: "Consultas, horários e check-ins organizados em tempo real.",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    icon: FileText,
    label: "Documentos Clínicos",
    desc: "Receitas, atestados e exames gerados e arquivados digitalmente.",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
];

const HomeScreen = () => {
  const { user } = useAuthContext();

  const quickLinks = quickLinksConfig.filter(
    (link) => !user || link.roles.includes(user.role)
  );

  const getGridCols = () => {
    if (quickLinks.length <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (quickLinks.length <= 4) return "grid-cols-2 sm:grid-cols-2";
    if (quickLinks.length <= 6) return "grid-cols-2 sm:grid-cols-3";
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  };

  const roleLabels = {
    Diretor: { label: "Diretor", color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
    Médico: { label: "Médico", color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
    Atendente: { label: "Atendente", color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  };

  const roleInfo = user?.role ? roleLabels[user.role] : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header institucional */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Olá, {user?.nome?.split(" ")[0] || "Usuário"} 👋
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Bem-vindo ao painel do MedAgenda. Selecione uma função para começar.
              </p>
            </div>
            {roleInfo && (
              <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Acesso Rápido */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-semibold text-slate-700">Acesso Rápido</h2>
            <span className="text-xs text-slate-400 bg-slate-100 rounded-md px-2 py-0.5">
              {quickLinks.length} módulos disponíveis
            </span>
          </div>
          <div className={`grid gap-3 ${getGridCols()}`}>
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.to}
                  className="group bg-white border border-slate-200 rounded-lg p-4 no-underline flex items-start gap-3.5 hover:border-blue-300 hover:shadow-sm transition-all duration-150"
                >
                  <div className="w-9 h-9 rounded-md bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                    <Icon size={17} className="text-slate-500 group-hover:text-blue-700 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors leading-tight">
                      {link.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t border-slate-200" />

        {/* Sobre o sistema */}
        <section>
          <h2 className="text-base font-semibold text-slate-700 mb-5">Sobre o Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statConfig.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4"
                >
                  <div className={`w-10 h-10 rounded-md ${stat.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={stat.color} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-1">{stat.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Rodapé */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">MedAgenda © {new Date().getFullYear()} — Todos os direitos reservados</p>
          <p className="text-xs text-slate-400">Sistema de Gestão de Saúde</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;