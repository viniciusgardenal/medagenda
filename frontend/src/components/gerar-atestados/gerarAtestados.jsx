import React, { useState, useEffect } from "react";
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
            const response = await criarAtestado(dados);
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `atestado_${dados.cpfPaciente}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            setPacienteSelecionado("");
            setMatriculaProfissional("");
            setTipoAtestado("");
        } catch (error) {
            console.error("Erro ao gerar atestado", error);
        }
    };

    return (
        <section className="container mx-auto my-10 p-4 bg-white rounded-lg shadow-md max-w-2xl">
            <h2 className="text-2xl text-gray-800 font-bold text-center mb-4">
                Gerar Atestados Médicos
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="flex flex-col space-y-1">
                    <label className="text-gray-700 font-semibold text-sm">
                        Paciente:
                    </label>
                    <select
                        name="PacienteCpf"
                        value={pacienteSelecionado}
                        onChange={handlePacienteChange}
                        required
                        className="border border-gray-300 rounded-md p-1.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#001233] transition-colors"
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

                <div className="flex flex-col space-y-1">
                    <label className="text-gray-700 font-semibold text-sm">
                        Tipo de Atestado:
                    </label>
                    <select
                        name="tipoAtestado"
                        value={tipoAtestado}
                        onChange={handleTipoAtestadoChange}
                        required
                        className="border border-gray-300 rounded-md p-1.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#001233] transition-colors"
                    >
                        <option value="">Selecione o Tipo de Atestado</option>
                        <option value="Médico">Médico</option>
                        <option value="Odontológico">Odontológico</option>
                        <option value="Psicológico">Psicológico</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-[#001233] text-white px-4 py-1.5 rounded-md font-semibold text-sm hover:bg-[#153a80] transition-colors w-full"
                >
                    Gerar Atestado
                </button>
            </form>
        </section>
    );
};

export default GerarAtestados;