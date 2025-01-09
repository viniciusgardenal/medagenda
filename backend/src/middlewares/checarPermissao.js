const Roles = require("../model/roles");
const Permissao = require("../model/permissao");

const checarPermissao = (permissaoNecessaria) => {
  return async (req, res, next) => {
    try {
      // //console.log("Permissão necessária:", permissaoNecessaria);
      // //console.log("Usuário do token:", req.user);

      // Verifique se o usuário tem o campo 'role' no token
      if (!req.user || !req.user.role) {
        console.error("Role do usuário ausente no token.");
        return res.status(401).json({
          message: "Acesso não autorizado: papel do usuário não encontrado.",
        });
      }

      const userRole = req.user.role;
      //console.log("Role do usuário:", userRole);

      // Buscar o papel (role) do usuário e as permissões associadas
      const role = await Roles.findOne({
        where: { nome: userRole },
        include: [
          {
            model: Permissao,
            as: "permissoes", // Alias que você usou na associação
            attributes: ["nome"], // Carregar apenas o nome da permissão
          },
        ],
      });

      //console.log("Role encontrado:", role);

      if (!role) {
        return res.status(403).json({
          message: "Acesso negado: papel do usuário não encontrado.",
        });
      }

      // console.log("Permissões do papel encontrado:", role.permissoes);

      // Verifique se a permissão necessária existe nas permissões do role
      const hasPermission = role.permissoes.some(
        (permissao) => permissao.nome === permissaoNecessaria
      );

      if (!hasPermission) {
        return res.status(403).json({
          message:
            "Acesso negado: Você não tem permissão para acessar essa rota.",
        });
      }

      // Se a permissão for encontrada, a requisição segue
      next();
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  };
};

module.exports = checarPermissao;
