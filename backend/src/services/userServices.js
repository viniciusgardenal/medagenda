const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

const registerUser = async (email, nome, password) => {
    const userExists = await userModel.findUserByEmail(email);
    if (userExists) {
        throw new Error("Usuário com este e-mail já existe.");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    await userModel.createUser(email, nome, hashedPassword);
};

const loginUser = async (email, password) => {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
        throw new Error('Credenciais incorretas');
    }

    // Corrigido: agora usa 'user.senha' em vez de 'user.password'
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error('Credenciais incorretas');
    }

    const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, process.env.JWT_SECRET);
    return token;
};

module.exports = { registerUser, loginUser };
