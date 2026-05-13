const axios = require('axios');

async function testConnection() {
  const url = 'https://free.uazapi.com/instance/status';
  const token = 'ba621665-afac-4dea-a56d-828309e93e9d';

  try {
    console.log('🔄 Verificando status da instância na Uazapi...');
    const response = await axios.get(url, {
      headers: { token }
    });
    console.log('✅ Sucesso! Dados retornados:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Erro na requisição:');
    console.error(error.response ? error.response.data : error.message);
  }
}

testConnection();