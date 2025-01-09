import React, { useState, useEffect } from "react";
import "./solicitacaoExamesStyle.css";
import axios from "axios";

const SolicitacaoExames = () => {
  const [dadosBanco, setDadosBanco] = useState({
    medicos: [],
    paciente: [],
  });

  const [exames, setExames] = useState([]);
  const [tiposExames, setTiposExames] = useState([]); // Novo estado para os tipos de exames
  const [profissionais, setProfissionais] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [novoExame, setNovoExame] = useState({
    tipoExameId: "",
    periodo: "",
    retorno: "",
    Medico_matricula: "",
    Paciente_matricula: "",
  });

  const [exameSelecionado, setExameSelecionado] = useState(false);

  // Função para buscar todos os exames
  const buscarExames = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/solicitacaoExames"
      );
      setExames(response.data);
    } catch (error) {
      console.error("Erro ao buscar exames:", error);
    }
  };

  // Função para buscar os tipos de exames
  const buscarTipoExames = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tiposExames");
      setTiposExames(response.data); // Atualiza o estado com os tipos de exames
    } catch (error) {
      console.error("Erro ao buscar Tipos de Exames:", error);
    }
  };

  // Função para buscar os tipos de exames
  const buscarProfissioanis = async () => {
    try {
      const response = await axios.get("http://localhost:5000/profissionais");
      setProfissionais(response.data); // Atualiza o estado com os tipos de exames
    } catch (error) {
      console.error("Erro ao buscar Profissionais:", error);
    }
  };

  // Função para buscar os tipos de exames
  const buscarPaciente = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pacientes");
      setPacientes(response.data); // Atualiza o estado com os tipos de exames
    } catch (error) {
      console.error("Erro ao buscar Pacientes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(novoExame);

    try {
      if (exameSelecionado) {
        await axios.put(
          `http://localhost:5000/solicitacaoExames/${novoExame.idExame}`,
          novoExame
        );
        alert("Exame atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:5000/solicitacaoExames", novoExame);
        alert("Exame criado com sucesso!");
      }
      setNovoExame({
        tipoExameId: "",
        periodo: "",
        retorno: "",
        Medico_matricula: "",
        Paciente_matricula: "",
      });
      setExameSelecionado(false);
      buscarExames(); // Recarrega a lista de exames
    } catch (error) {
      console.error("Erro ao salvar o exame:", error);
      alert("Ocorreu um erro ao salvar o exame.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoExame((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const atualizarExame = async (id) => {
    try {
      setExameSelecionado(true);
      const response = await axios.get(
        `http://localhost:5000/solicitacaoExames/${id}`
      );
      const examesEditar = response.data;
      setNovoExame({
        idExame: id,
        tipoExameId: examesEditar.tipoExameId,
        periodo: examesEditar.periodo,
        retorno: examesEditar.retorno,
        Medico_matricula: examesEditar.Medico_matricula,
        Paciente_matricula: examesEditar.Paciente_matricula,
      });
    } catch (error) {
      console.error("Erro ao buscar Exame:", error);
    }
  };

  const excluirExame = async (id) => {
    // //console.log(id);
    try {
      await axios.delete(`http://localhost:5000/solicitacaoExames/${id}`);
      alert("Exame Excluido com sucesso!");
      buscarExames();
    } catch (error) {
      console.error(
        "Erro ao salvar o Exames:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    buscarExames();
    buscarTipoExames(); // Carrega os tipos de exames ao montar o componente
    buscarProfissioanis();
    buscarPaciente();
  }, []);

  return (
    <div className="tipos-exames-crud">
      <h2>Solicitação de Exames</h2>
      <form className="exame-form" onSubmit={handleSubmit}>
        <div>
          <label>Tipo de Exame:</label>
          <select
            name="tipoExameId"
            value={novoExame.tipoExameId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o tipo de exame</option>
            {tiposExames.map((tipo) => (
              <option key={tipo.idTipoExame} value={tipo.idTipoExame}>
                {tipo.nomeTipoExame}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Período:</label>
          <select
            name="periodo"
            value={novoExame.periodo}
            onChange={handleChange}
          >
            <option value="">Selecione Período</option>
            <option value="Manha">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
          </select>
        </div>

        <label>
          Retorno:
          <input
            type="text"
            name="retorno"
            placeholder="Retorno"
            value={novoExame.retorno}
            onChange={handleChange}
            required
          />
        </label>
        <div>
          <label>Médico:</label>
          <select
            name="Medico_matricula"
            value={novoExame.Medico_matricula}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o Médico</option>
            {profissionais
              .filter((tipo) => tipo.tipoProfissional === "Medico")
              .map((medico) => (
                <option key={medico.matricula} value={medico.matricula}>
                  {medico.nome}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Paciente:</label>
          <select
            name="Paciente_matricula"
            value={novoExame.Paciente_matricula}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o Paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.cpf} value={paciente.cpf}>
                {paciente.nome} {paciente.sobrenome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">
          {exameSelecionado ? "Atualizar Exame" : "Adicionar Exame"}
        </button>
      </form>
      <table className="exames-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo Exame</th>
            <th>Período</th>
            <th>Retorno</th>
            <th>Médico</th>
            <th>Paciente</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {exames.map((exame) => (
            <tr key={exame.idExame}>
              <td>{exame.idExame}</td>
              <td>{exame.tipoExame.nomeTipoExame}</td>
              <td>{exame.periodo}</td>
              <td>{exame.retorno}</td>
              <td>
                {exame.medico.nome} - ({exame.medico.crm})
              </td>
              <td>
                {exame.paciente.nome} {exame.paciente.sobrenome}
              </td>
              {
                <td>
                  <button onClick={() => atualizarExame(exame.idExame)}>
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                  </button>
                  <button onClick={() => excluirExame(exame.idExame)}>
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                  </button>
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolicitacaoExames;
