// import React, { useState, useEffect } from "react";
// import './medicamentosStyle.css';

// const Medicamentos = () => {
//     const [medicamentos, setMedicamentos] = useState([]);
//     const [formData, setFormData] = useState({
//         idMedicamento: '',
//         nomeMedicamento: '',
//         dosagem: '',
//         controlado: '',
//         nomeFabricante: '',
//         descricao: '',
//         instrucaoUso: '',
//         interacao: ''
//     });
//     const [isEditing, setIsEditing] = useState(false);

//     useEffect(() => {
//         fetch('http://localhost:5000/medicamentos')
//             .then(response => response.json())
//             .then(data => {
//                 if (Array.isArray(data)) {
//                     setMedicamentos(data);
//                 } else {
//                     console.error('Resposta da API não é um array:', data);
//                 }
//             })
//             .catch(error => console.error('Erro ao buscar medicamento:', error));
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     const handleAddMedicamento = () => {
//         const url = isEditing 
//             ? `http://localhost:5000/medicamentos/${formData.idMedicamento}` 
//             : 'http://localhost:5000/medicamentos';

//         fetch(url, {
//             method: isEditing ? 'PUT' : 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         })
//         .then(response => response.json())
//         .then(data => {
//             //console.log('Medicamento adicionado/atualizado:', data);
//             setFormData({
//                 idMedicamento: '',
//                 nomeMedicamento: '',
//                 dosagem: '',
//                 controlado: '',
//                 nomeFabricante: '',
//                 descricao: '',
//                 instrucaoUso: '',
//                 interacao: ''
//             });
//             setIsEditing(false);
//             setMedicamentos(prevMedicamentos => isEditing 
//                 ? prevMedicamentos.map(medicamento => medicamento.idMedicamento === data.idMedicamento ? data : medicamento)
//                 : [...prevMedicamentos, data]);
//         })
//         .catch(error => console.error('Erro ao adicionar/atualizar medicamento:', error));
//     };

//     const handleEditMedicamento = (medicamento) => {
//         setFormData(medicamento);
//         setIsEditing(true);
//     };

//     const handleDeleteMedicamento = (id) => {
//         fetch(`http://localhost:5000/medicamentos/${id}`, {
//             method: 'DELETE',
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Erro ao deletar o medicamento');
//             }
//             return response;
//         })
//         .then(() => {
//             //console.log('Medicamento deletado com sucesso');
//             setMedicamentos(prevMedicamentos => prevMedicamentos.filter(medicamento => medicamento.idMedicamento !== id));
//         })
//         .catch(error => console.error('Erro ao deletar medicamento:', error));
//     };

//     return (
//         <div className="medicamentos-crud">
//             <h2>Gerenciamento de Medicamentos</h2>
//             <form className="medicamento-form" onSubmit={(e) => e.preventDefault()}>
//                 <div>
//                     <label>Nome medicamento</label>
//                     <input 
//                         type="text" 
//                         name="nomeMedicamento" 
//                         placeholder="Nome do Medicamento" 
//                         value={formData.nomeMedicamento} 
//                         onChange={handleInputChange} 
//                         required />
//                 </div>
//                 <div>
//                     <label>Dosagem</label>
//                     <input 
//                         type="text" 
//                         name="dosagem" 
//                         placeholder="Dosagem" 
//                         value={formData.dosagem} 
//                         onChange={handleInputChange} 
//                         required />
//                 </div>
//                 <div>
//                     <label>Controle</label>
//                     <select 
//                         name="controlado" 
//                         value={formData.controlado} 
//                         onChange={handleInputChange} 
//                         required>
//                         <option value="">Selecione</option>
//                         <option value="Medicamento Controlado">Medicamento Controlado</option>
//                         <option value="Medicamento Não Controlado">Medicamento Não Controlado</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label>Nome do Fabricante</label>                
//                     <input 
//                         type="text" 
//                         name="nomeFabricante" 
//                         placeholder="Nome do Fabricante" 
//                         value={formData.nomeFabricante} 
//                         onChange={handleInputChange} 
//                         required />
//                 </div>
//                 <div>
//                     <label>Descrição</label> 
//                     <input 
//                         type="text" 
//                         name="descricao" 
//                         placeholder="Descrição" 
//                         value={formData.descricao} 
//                         onChange={handleInputChange} 
//                         required />
//                 </div>
//                 <div>
//                     <label>Instrução de Uso</label> 
//                     <input 
//                         type="text" 
//                         name="instrucaoUso" 
//                         placeholder="Instrução de uso" 
//                         value={formData.instrucaoUso} 
//                         onChange={handleInputChange} 
//                         equired />
//                 </div>
//                 <div>
//                     <label>Interação Medicamentosa</label> 
//                     <input 
//                         type="text" 
//                         name="interacao" 
//                         placeholder="Interação medicamentosa" 
//                         value={formData.interacao} 
//                         onChange={handleInputChange} 
//                         required />
//                 </div>
//                 <button
//                     type="button" 
//                     onClick={handleAddMedicamento}>{isEditing ? "Atualizar Medicamento" : "+ Adicionar Medicamento"}
//                 </button>
//             </form>
//             <table className="medicamentos-table">
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Nome do Medicamento</th>
//                         <th>Dosagem</th>
//                         <th>Controlado</th>
//                         <th>Nome do Fabricante</th>
//                         <th>Descrição</th>
//                         <th>Instrução de Uso</th>
//                         <th>Interação medicamentosa</th>
//                         <th>Ações</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {Array.isArray(medicamentos) && medicamentos.map((medicamento) => (
//                         <tr key={medicamento.idMedicamento}>
//                             <td>{medicamento.idMedicamento + 1}</td>
//                             <td>{medicamento.nomeMedicamento}</td>
//                             <td>{medicamento.dosagem}</td>
//                             <td>{medicamento.controlado}</td>
//                             <td>{medicamento.nomeFabricante}</td>
//                             <td>{medicamento.descricao}</td>
//                             <td>{medicamento.instrucaoUso}</td>
//                             <td>{medicamento.interacao}</td>
//                             <td>
//                                 <button onClick={() => handleEditMedicamento(medicamento)}>Editar</button>
//                                 <button onClick={() => handleDeleteMedicamento(medicamento.idMedicamento)}>Deletar</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Medicamentos;
