export const checkPermissoes = (user, requiredPermissao, rolesPermissao) => {
  if (user && user.permissao && user.role) {
    // // Verifica se o usuário tem a permissão necessária
    // //console.log("checkPermissoes - Permissões do usuário: ", user.permissao);
    // //console.log("Permissão requerida: ", requiredPermissao);
    // //console.log("Roles permitidos: ", rolesPermissao);
    // //console.log("Role do usuário: ", user.role);

    // Verifica se o usuário pertence a uma das roles permitidas
    const rolePermitida = rolesPermissao.includes(user.role);

    // Verifica se o usuário possui a permissão necessária
    const permissaoValida = Array.isArray(user.permissao)
      ? user.permissao.includes(requiredPermissao)
      : user.permissao.includes(requiredPermissao);

    // Retorna true se ambas as condições forem atendidas
    return rolePermitida && permissaoValida;
  }

  // Se não passar em nenhum dos testes, retorna false
  return false;
};
