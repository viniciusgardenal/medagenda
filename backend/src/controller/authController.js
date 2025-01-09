const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profissional = require("../model/profissionais");
const Roles = require("../model/roles");
const Permissao = require("../model/permissao");

const login = async (req, res) => {
  const { email, password } = req.body;

  // //console.log(`Login ${email} e senha ${password} `);

  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  }

  try {
    const user = await Profissional.findOne({
      where: { email },
      include: [
        {
          model: Roles,
          as: "roles",
          include: [{ model: Permissao, as: "permissoes" }],
        },
      ],
    });
    if (!user) {
      return res.status(400).json({ message: "E-mail Incorreto!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Senha Incorreta!" });
    }

    const permissao = user.roles.permissoes.map((p) => p.nome);

    const token = jwt.sign(
      {
        id: user.matricula,
        nome: user.nome,
        email: user.email,
        role: user.roles.nome,
        crm: user.crm,
        permissao,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login };
