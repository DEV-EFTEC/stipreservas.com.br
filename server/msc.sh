#!/bin/bash

# Verifica se o nome foi fornecido
if [ -z "$1" ]; then
  echo "❌ Por favor, forneça o nome do módulo. Ex: ./generate.sh booking"
  exit 1
fi

# Formata o nome
name_lower=$(echo "$1" | tr '[:upper:]' '[:lower:]')
name_capitalized=$(echo "${name_lower^}")

# Cria os diretórios se não existirem
mkdir -p src/models src/services src/controllers src/routes

# Cria o model
cat <<EOF > src/models/${name_lower}Model.js
// ${name_capitalized} Model
import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function findAll${name_capitalized}s() {
  return db('${name_lower}s').select('*');
}

// Adicione outras funções conforme necessário
EOF

# Cria o service
cat <<EOF > src/services/${name_lower}Service.js
// ${name_capitalized} Service
import * as ${name_lower}Model from '../models/${name_lower}Model.js';

export async function getAll${name_capitalized}s() {
  return ${name_lower}Model.findAll${name_capitalized}s();
}

// Adicione regras de negócio aqui
EOF

# Cria o controller
cat <<EOF > src/controllers/${name_lower}Controller.js
// ${name_capitalized} Controller
import * as ${name_lower}Service from '../services/${name_lower}Service.js';
import logger from '#core/logger.js';

export async function getAll(req, res) {
  try {
    const result = await ${name_lower}Service.getAll${name_capitalized}s();
    res.status(200).json(result);
  } catch (err) {
    logger.error('Error on getAll', { err });
    res.status(500).json({ error: 'Erro ao buscar ${name_lower}s' });
  }
}
EOF

# Cria a rota
cat <<EOF > src/routes/${name_lower}.routes.js
// ${name_capitalized} Routes
import express from 'express';
import * as ${name_lower}Controller from '../controllers/${name_lower}Controller.js';

const router = express.Router();

router.get('/', ${name_lower}Controller.getAll);

export default router;
EOF

echo "✅ Módulo '${name_capitalized}' criado com sucesso!"
