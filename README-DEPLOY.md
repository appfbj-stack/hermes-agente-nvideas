# 🚀 Guia de Deploy (Produção) - Hermes SaaS

Este guia ensina como colocar o Backend, o Worker e a Inteligência Artificial do Hermes no ar em uma VPS (Hostinger, Hetzner, DigitalOcean, etc.).

## 📌 Pré-requisitos
1. Uma VPS com Ubuntu 20.04 ou superior.
2. Acesso SSH à VPS.
3. No mínimo 2GB de RAM (Recomendado 4GB para rodar os 3 serviços Node.js + Redis com folga).

## 🛠️ Como fazer o Deploy

### Passo 1: Enviar o código para a VPS
Você pode enviar o código clonando o seu repositório do GitHub direto na VPS:
```bash
git clone https://github.com/appfbj-stack/hermes-agente-nvideas.git
cd hermes-agente-nvideas
```

### Passo 2: Dar permissão ao script de deploy
O script `deploy.sh` automatiza a instalação do Docker e sobe todos os serviços de uma vez.
```bash
chmod +x deploy.sh
```

### Passo 3: Executar o Deploy
Execute o script:
```bash
./deploy.sh
```

**Importante:** Na primeira vez que você rodar, o script vai parar e criar um arquivo chamado `.env`.
Você precisará editar esse arquivo com as suas chaves de produção (Supabase, Uazapi, OpenAI).

Para editar o arquivo na VPS:
```bash
nano .env
```
*(Preencha os dados, aperte `Ctrl + O` para salvar, `Enter` para confirmar e `Ctrl + X` para sair).*

Após preencher o `.env`, rode o script novamente:
```bash
./deploy.sh
```

### Passo 4: Expor a porta 3333 para a Web
O seu Backend está rodando na porta `3333`. Para que a Vercel (Frontend) consiga se comunicar com ele, você precisa apontar um domínio para a sua VPS usando um Nginx ou Caddy, e gerar um SSL (HTTPS). 

Recomendamos usar o **Cloudflare** para apontar o DNS para o IP da sua VPS, ou instalar o **Nginx Proxy Manager** (que já gera o SSL grátis).

*Lembrete: Atualize a variável `VITE_BACKEND_URL` na Vercel para o seu novo domínio do backend (ex: `https://api.seudominio.com.br`).*

## 🔍 Comandos Úteis no Dia a Dia

**Ver os logs em tempo real (para ver as mensagens do Zap chegando):**
```bash
docker-compose logs -f
```

**Ver os logs APENAS da Inteligência Artificial (Hermes):**
```bash
docker-compose logs -f hermes-ai
```

**Reiniciar tudo:**
```bash
docker-compose restart
```

**Atualizar o código (quando você fizer mudanças no GitHub):**
```bash
git pull origin main
./deploy.sh
```
