import React from "react";
import "./homeStyle.css";

const HomeScreen = () => {
    return (
        <div className="home-container mt-5 mb-5 bg-[#001233] flex items-center justify-center">
            <div className="bg-[#001233] mb-0 rounded-lg ">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Bem-vindo ao MedAgenda</h1>
                    <p className="text-1xl">
                        Seu sistema de gerenciamento de agendas médicas, desenvolvido para
                        otimizar o atendimento e garantir qualidade e eficiência no cuidado
                        dos pacientes.
                    </p>
                </header>

                <section className="mb-4">
                    <h2 className="text-2xl text-white font-semibold mb-4">Links Rápidos</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="/profissionais"
                            className="bg-[#f1f1f1] no-underline text-[#001233] px-6 py-3 rounded-md text-lg"
                        >
                            Profissionais
                        </a>
                        <a
                            href="/pacientes"
                            className="bg-[#f1f1f1] no-underline text-[#001233] px-6 py-3 rounded-md text-lg"
                        >
                            Pacientes
                        </a>
                        <a
                            href="/medicamentos"
                            className="bg-[#f1f1f1] no-underline text-[#001233] px-6 py-3 rounded-md text-lg"
                        >
                            Medicamentos
                        </a>
                        <a
                            href="/tiposExames"
                            className="bg-[#f1f1f1] no-underline text-[#001233] px-6 py-3 rounded-md text-lg"
                        >
                            Tipos de Exames
                        </a>
                        <a
                            href="/planoDeSaude"
                            className="bg-[#f1f1f1] no-underline text-[#001233] px-6 py-3 rounded-md text-lg"
                        >
                            Planos de Saúde
                        </a>
                        <a
                            href="/tipoConsulta"
                            className="bg-[#f1f1f1] no-underline text-[#001233] px-6 py-3 rounded-md text-lg"
                        >
                            Tipos de Consultas
                        </a>
                    </div>
                </section>

                <section className="mb-4">
                    <h2 className="text-2xl text-white font-semibold mb-4">Benefícios do MedAgenda</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#F1F1F1] p-8 rounded-lg shadow-lg text-[#001233]">
                            <h3 className="text-xl font-semibold mb-2">Gestão Eficiente de Consultas</h3>
                            <p className="text-1lg mb-4 text-[#001233]">
                                Com MedAgenda, o agendamento de consultas torna-se mais ágil e organizado, garantindo que cada paciente receba o atendimento adequado no momento certo.
                            </p>
                        </div>
                        <div className="bg-[#F1F1F1] p-8 rounded-lg shadow-lg text-[#001233]">
                            <h3 className="text-xl font-semibold mb-2">Controle de Medicamentos e Exames</h3>
                            <p className="text-1lg mb-4 text-[#001233]">
                                O MedAgenda facilita a solicitação de exames, prescrição de medicamentos e acompanhamento dos resultados, garantindo que nenhuma informação importante se perca.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default HomeScreen;
