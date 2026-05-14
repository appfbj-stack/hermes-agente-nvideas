#!/bin/bash

# Hermes SaaS - Script de Deploy Automatizado para VPS (Ubuntu/Debian)
# Execução recomendada como root (sudo)

echo "🚀 Iniciando Deploy do Hermes SaaS..."

# 1. Atualizar pacotes
echo "📦 Atualizando pacotes do sistema..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Instalar Docker e Docker Compose (se não existirem)
if ! command -v docker &> /dev/null
then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
else
    echo "✅ Docker já está instalado."
fi

if ! command -v docker-compose &> /dev/null
then
    echo "🐳 Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose já está instalado."
fi

# 3. Configurar variáveis de ambiente
if [ ! -f .env ]; then
    echo "⚠️ Arquivo .env não encontrado na raiz!"
    echo "Criando .env base. POR FAVOR, edite o arquivo .env e adicione suas credenciais do Supabase e OpenAI/OpenRouter."
    
    cat <<EOT >> .env
# Supabase
SUPABASE_URL=sua_url_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# OpenAI / OpenRouter
OPENAI_API_KEY=sua_chave_aqui
OPENROUTER_API_KEY=sua_chave_openrouter_aqui

# Uazap / WhatsApp
UAZAP_API_URL=https://free.uazapi.com
UAZAP_API_KEY=seu_token_admin_uazap
EOT

    echo "🛑 O script foi pausado. Edite o arquivo .env gerado e rode './deploy.sh' novamente."
    exit 1
fi

# 4. Build e Start dos containers
echo "🏗️ Construindo as imagens e subindo os containers..."
sudo docker-compose down
sudo docker-compose up -d --build

# 5. Limpeza de imagens antigas
echo "🧹 Limpando imagens órfãs do Docker para economizar espaço..."
sudo docker image prune -f

echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "--------------------------------------------------------"
echo "Serviços em execução:"
echo "- 🟢 Backend API: Porta 3333"
echo "- 🧠 Hermes AI: Porta 3334"
echo "- ⚙️ Workers: Rodando em background"
echo "- 🗄️ Redis: Porta 6379"
echo "--------------------------------------------------------"
echo "Para visualizar os logs em tempo real, digite:"
echo "docker-compose logs -f"
