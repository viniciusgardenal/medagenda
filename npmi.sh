#!/bin/bash

# Caminhos para as pastas backend e frontend
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# Função para executar npm install e npm start
run_npm_commands() {
  local dir=$1

  echo "============================"
  echo "Entrando na pasta: $dir"
  echo "============================"
  if [ -d "$dir" ]; then
    cd "$dir" || exit 1

    echo "Executando npm install..."
    npm install
    if [ $? -ne 0 ]; then
      echo "Erro ao executar npm install em $dir. Abortando."
      exit 1
    fi

    echo "Voltando ao diretório inicial..."
    cd - > /dev/null || exit 1
  else
    echo "A pasta $dir não foi encontrada. Certifique-se de que ela existe."
    exit 1
  fi
}

# Executa os comandos para backend
run_npm_commands "$BACKEND_DIR"

# Executa os comandos para frontend
run_npm_commands "$FRONTEND_DIR"

echo "Script concluído com sucesso!"
