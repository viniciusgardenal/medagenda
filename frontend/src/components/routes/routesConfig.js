// src/routes/routesConfig.js
import TiposExames from "../tiposExames/tiposExames2";
import SolicitacaoExames from "../solicitacaoExames/solicitacaoExames";
import Medicamentos from "../medicamentos/medicamentos";
import Profissionais from "../profissionais/profissionais";
import Pacientes from "../pacientes/pacientes";
import HomeScreen from "../home/homeScreen";
import EmitirReceitas from "../receitas/emitirReceitas";
import GerarAtestados from "../gerar-atestados/gerarAtestados";
import RegistroResultadoExame from "../registroResultadoExames/RegistroResultadoExames";
import LoginScreen from "../loginScreen/loginScreen";
import Unauthorized from "../unauthorized/unauthorized";
import PlanoDeSaude from "../planoDeSaude/planoDeSaude";
import TipoConsulta from "../tipoConsulta/tipoConsulta";
import CheckInPacientes from "../checkinPacientes/CheckInPacientes";
import GerenciarHorariosProfissionais from "../gerenciarHorariosProfissionais/gerenciarHorariosProfissionais"; // Novo import
import AgendamentoConsulta from "../agendamentosConsultas/AgendamentoConsulta";
import GerenciarRegistroObitos from "../registroObitos/GerenciarRegistroObitos.jsx";
import RegistroAtendimento from "../realizarAtendimentos/registroAtendimento.jsx";

const routes = [
  { path: "/", element: <LoginScreen />, protected: false },
  {
    path: "/home",
    element: <HomeScreen />,
    protected: false,
    rolesPermitidos: ["Diretor", "Atendente", "Médico"],
  },
  {
    path: "/tiposExames",
    element: <TiposExames />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/tipoConsulta",
    element: <TipoConsulta />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/planoDeSaude",
    element: <PlanoDeSaude />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor"],
  },
  {
    path: "/solicitacaoExames",
    element: <SolicitacaoExames />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/medicamentos",
    element: <Medicamentos />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/profissionais",
    element: <Profissionais />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor"],
  },
  {
    path: "/pacientes",
    element: <Pacientes />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Atendente"],
  },
  {
    path: "/emitir-receitas",
    element: <EmitirReceitas />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/emitir-atestados",
    element: <GerarAtestados />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/registrar-resultados-exames",
    element: <RegistroResultadoExame />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/consultas",
    element: <AgendamentoConsulta />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico", "Atendente"],
  },

  {
    path: "/checkin-pacientes",
    element: <CheckInPacientes />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico", "Atendente"],
  },
  {
    path: "/horarios-profissionais",
    element: <GerenciarHorariosProfissionais />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor"], // Apenas Diretor pode gerenciar horários
  },
  {
    path: "/registro-obitos",
    element: <GerenciarRegistroObitos />,
    protected: true,
    permissao: "consultar",
    rolesPermitidos: ["Diretor"],
  },
  {
    path: "/atendimentos",
    element: <RegistroAtendimento />,
    permissao: "consultar",
    rolesPermitidos: ["Diretor", "Médico"],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
    protected: false,
    permissao: "consultar",
  },
];

export default routes;
