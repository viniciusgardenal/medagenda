// import React, { useState, useEffect } from "react";
// import "./pacientesStyle.css";
// import "../profissionais/modalProfissional.css";
// import "../tiposExames/tiposExamesStyle.css";
// import axios from "axios";
// import moment from "moment";
// import {
//   criarPacientes,
//   excluirPacientes,
//   getPacientes,
//   getPacientesId,
//   updatePacientes,
// } from "../../config/apiServices";

// const Pacientes = () => {
//   const [pacientes, setPacientes] = useState([]);
//   const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
//   const [termoBusca, setTermoBusca] = useState("");
//   const [novoPaciente, setNovoPaciente] = useState({
//     cpf: "",
//     idPaciente: "",
//     nome: "",
//     sobrenome: "",
//     sexo: "",
//     dataNascimento: "",
//     email: "",
//     endereco: "",
//     telefone: "",
//   });

//   const [pacienteSelecionado, setPacienteSelecionado] = useState(false);

//   // Função para buscar todos os pacientes
//   const buscarPacientes = async () => {
//     try {
//       const response = await getPacientes();
//       setPacientes(response.data);
//       setPacientesFiltrados(response.data); // Inicialmente exibe todos os pacientes
//     } catch (error) {
//       console.error("Erro ao buscar pacientes:", error);
//     }
//   };

//   // Função para enviar os dados do paciente (criar ou editar)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     //console.log(`Entoru aqui ?`);
//     try {
//       if (pacienteSelecionado === true) {
//         const response = updatePacientes(novoPaciente.cpf, novoPaciente);
//         // //console.log((await response).status);
//         //console.log(response);
//         if ((await response).status) alert("Paciente atualizado com sucesso!");
//       } else {
//         const response = await criarPacientes(novoPaciente);
//         //console.log(response.data);
//         alert("Paciente criado com sucesso!");
//       }
//       setNovoPaciente({
//         cpf: "",
//         idPaciente: "",
//         nome: "",
//         sobrenome: "",
//         sexo: "",
//         dataNascimento: "",
//         email: "",
//         endereco: "",
//         telefone: "",
//       });
//       setPacienteSelecionado(false);
//       buscarPacientes();
//     } catch (error) {
//       // console.error(
//       //   "Erro ao salvar o paciente:",
//       //   error.response ? error.response.data : error.message
//       // );
//       alert("Ocorreu um erro ao Salvar/Editar o paciente.");
//     }
//   };
//   // Função para aplicar a máscara no CPF
//   const mascaraCPF = (value) => {
//     return value
//       .replace(/\D/g, "") // Remove tudo o que não for número
//       .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Aplica a máscara
//   };

//   // Função para aplicar a máscara no Telefone
//   const mascaraTelefone = (value) => {
//     return value
//       .replace(/\D/g, "") // Remove tudo o que não for número
//       .replace(/^(\d{2})(\d)/, "($1) $2") // Adiciona parênteses ao código de área
//       .replace(/(\d{5})(\d{4})/, "$1-$2"); // Adiciona o hífen ao número
//   };

//   // Função que é chamada sempre que o usuário digitar no campo
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Aplica a máscara dependendo do campo
//     let valorComMascara = value;
//     if (name === "cpf") {
//       valorComMascara = mascaraCPF(value);
//     } else if (name === "telefone") {
//       valorComMascara = mascaraTelefone(value);
//     }

//     // Atualiza o estado com o valor formatado
//     setNovoPaciente((prev) => ({
//       ...prev,
//       [name]: valorComMascara,
//     }));
//   };

//   // Função para atualizar um paciente
//   const atualizarPaciente = async (cpf) => {
//     try {
//       setPacienteSelecionado(true);
//       const response = await getPacientesId(cpf);
//       const pacienteParaEditar = response.data;
//       // //console.log(pacienteParaEditar);

//       setNovoPaciente({
//         cpf: cpf,
//         nome: pacienteParaEditar.nome,
//         sobrenome: pacienteParaEditar.sobrenome,
//         sexo: pacienteParaEditar.sexo,
//         dataNascimento: moment(
//           pacienteParaEditar.dataNascimento,
//           "DD/MM/YYYY"
//         ).format("YYYY-MM-DD"),
//         email: pacienteParaEditar.email,
//         endereco: pacienteParaEditar.endereco,
//         telefone: pacienteParaEditar.telefone,
//       });
//     } catch (error) {
//       console.error("Erro ao buscar paciente:", error);
//     }
//   };

//   // Função para excluir um paciente
//   const excluirPaciente = async (id) => {
//     //console.log(id);
//     try {
//       await excluirPacientes(id);
//       alert("Paciente Excluido com sucesso!");
//       buscarPacientes();
//     } catch (error) {
//       console.error(
//         "Erro ao salvar o paciente:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   // Função para filtrar pacientes com base no termo de busca
//   const handleBuscaChange = (e) => {
//     const termo = e.target.value.toLowerCase();
//     setTermoBusca(termo);
//     const filtrados = pacientes.filter((paciente) =>
//       Object.values(paciente).some((valor) =>
//         valor.toString().toLowerCase().includes(termo)
//       )
//     );
//     setPacientesFiltrados(filtrados);
//   };

//   useEffect(() => {
//     buscarPacientes();
//   }, []);

//   return (
//     <div className="pacientes-crud">
//       <h2>Pesquisar Pacientes</h2>

//       {/* Campo de busca para filtrar pacientes */}
//       <input
//         className="pesquisar-input"
//         type="text"
//         placeholder="Buscar paciente..."
//         value={termoBusca}
//         onChange={handleBuscaChange}
//       />
//       <h2>Cadastrar Pacientes</h2>
//       <form className="paciente-form tipo-exame-form" onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="nome">Nome</label>
//           <input
//             type="text"
//             id="nome"
//             name="nome"
//             placeholder="Nome"
//             value={novoPaciente.nome}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="sobrenome">Sobrenome</label>
//           <input
//             type="text"
//             id="sobrenome"
//             name="sobrenome"
//             placeholder="Sobrenome"
//             value={novoPaciente.sobrenome}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="cpf">CPF</label>
//           <input
//             type="text"
//             id="cpf"
//             name="cpf"
//             maxLength="11"
//             placeholder="123.456.789.01"
//             value={novoPaciente.cpf}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         {/* <div>
//           <label htmlFor="sexo">Sexo</label>
//           <input
//             type="text"
//             name="sexo"
//             placeholder=""
//             value={novoPaciente.sexo}
//             onChange={handleChange}
//             required
//           />
//         </div> */}

//         <div>
//           <label>Sexo:</label>
//           <select
//             type="text"
//             name="sexo"
//             value={novoPaciente.sexo}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Selecione</option>
//             <option value="M">Masculino</option>
//             <option value="F">Feminino</option>
//             <option value="O">Outro</option>
//           </select>
//         </div>

//         <div>
//           <label>Data de Nascimento</label>
//           <input
//             type="date"
//             name="dataNascimento"
//             placeholder="Data de Nascimento"
//             value={novoPaciente.dataNascimento}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label>E-mail</label>

//           <input
//             type="email"
//             name="email"
//             placeholder="exemplo@exemplo.com"
//             value={novoPaciente.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label>Endereço</label>

//           <input
//             type="text"
//             name="endereco"
//             placeholder="Endereço"
//             value={novoPaciente.endereco}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label>Telefone</label>

//           <input
//             type="text"
//             name="telefone"
//             maxLength={15}
//             placeholder="(00) 12345-6789"
//             value={novoPaciente.telefone}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke-width="1.5"
//             stroke="currentColor"
//             class="size-6"
//           >
//             <path
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               d="M12 4.5v15m7.5-7.5h-15"
//             />
//           </svg>
//           {pacienteSelecionado ? "Atualizar Paciente" : "Adicionar Paciente"}
//         </button>
//       </form>
//       <table className="pacientes-table">
//         <thead>
//           <tr>
//             <th>CPF</th>
//             <th>Nome Completo</th>
//             <th>Sexo</th>
//             <th>Data de Nascimento</th>
//             <th>Email</th>
//             <th>Endereço</th>
//             <th>Telefone</th>
//             <th>Ações</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pacientesFiltrados.map((paciente) => (
//             <tr key={paciente.cpf}>
//               <td>{paciente.cpf}</td>
//               <td>
//                 {paciente.nome} {paciente.sobrenome}
//               </td>
//               <td>{paciente.sexo}</td>
//               <td>{paciente.dataNascimento}</td>
//               <td>{paciente.email}</td>
//               <td>{paciente.endereco}</td>
//               <td>{paciente.telefone}</td>
//               <td>
//                 <button onClick={() => atualizarPaciente(paciente.cpf)}>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke-width="1.5"
//                     stroke="currentColor"
//                     class="size-6"
//                   >
//                     <path
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
//                     />
//                   </svg>
//                 </button>
//                 <button onClick={() => excluirPaciente(paciente.cpf)}>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="size-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                     />
//                   </svg>
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Pacientes;
