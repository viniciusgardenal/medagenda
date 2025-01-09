import React, { useState, useEffect } from "react";
import "./gerarAtestadosStyle.css";
import { criarAtestado, getPacientes, getProfissionais } from "../../config/apiServices";
import AtestadoForm from "./gerarAtestadoForm";

const GerarAtestados = () => {
    const [cpfPaciente, setCpfPaciente] = useState([]);
    const [matriculaProfissional, setMatriculaProfissional] = useState([]);
    const [tipoAtestado, setTipoAtestado] = useState("");
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");

    // Função para carregar dados de pacientes e profissionais
    const loadDados = async () => {
        try {
            const paciente = await getPacientes();
            if (Array.isArray(paciente.data)) {
                setCpfPaciente(paciente.data);
            } else {
                console.error("Os dados de pacientes não são um array", paciente.data);
            }

            const profissional = await getProfissionais();
            setMatriculaProfissional(profissional.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    };

    useEffect(() => {
        loadDados();
    }, []);

    const handlePacienteChange = (event) => {
        setPacienteSelecionado(event.target.value);
    };

    const handleProfissionalChange = (event) => {
        setMatriculaProfissional(event.target.value);
    };

    const handleTipoAtestadoChange = (event) => {
        setTipoAtestado(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const dados = {
          cpfPaciente: pacienteSelecionado,
          matriculaProfissional: matriculaProfissional,
          tipoAtestado, // Tipo de atestado
        };
      
        try {
          // Chama a função que cria o atestado e retorna o PDF (como blob)
          const response = await criarAtestado(dados);
      
          // Certifique-se de que a resposta é do tipo blob (arquivo PDF)
          const blob = response.data; // O arquivo PDF estará na propriedade "data" da resposta
      
          // Cria uma URL temporária para o blob
          const url = window.URL.createObjectURL(blob);
      
          // Cria um link e dispara o download do PDF
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `atestado_${dados.cpfPaciente}.pdf`; // Define o nome do arquivo
          document.body.appendChild(a);
          a.click();
      
          // Limpeza após o download
          window.URL.revokeObjectURL(url);
      
          // Opcional: Resetar os campos
          setPacienteSelecionado("");
          setMatriculaProfissional("");
          setTipoAtestado("");
      
        } catch (error) {
          console.error("Erro ao gerar atestado", error);
        }
      };
      

    return (
        <div className="gerar-atestados-container">
            <h2>Gerar Atestados Médicos</h2>
            <form className="atestado-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Paciente:</label>
                    <select
                        name="PacienteCpf"
                        value={pacienteSelecionado}
                        onChange={handlePacienteChange}
                        required
                    >
                        <option value="">Selecione o Paciente</option>
                        {Array.isArray(cpfPaciente) &&
                            cpfPaciente.map((pac) => (
                                <option value={pac.cpf} key={pac.cpf}>
                                    {pac.nome} {pac.sobrenome} (CPF: {pac.cpf})
                                </option>
                            ))}
                    </select>
                </div>

                <AtestadoForm onMatriculaChange={setMatriculaProfissional} />

                <div className="form-group">
                    <label>Tipo de Atestado:</label>
                    <select
                        name="tipoAtestado"
                        value={tipoAtestado}
                        onChange={handleTipoAtestadoChange}
                        required
                    >
                        <option value="">Selecione o Tipo de Atestado</option>
                        <option value="Médico">Médico</option>
                        <option value="Odontológico">Odontológico</option>
                        <option value="Psicológico">Psicológico</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>

                <button type="submit" className="gerar-button">
                    Gerar Atestado
                </button>
            </form>
        </div>
    );
};

export default GerarAtestados;
