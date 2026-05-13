import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import { supabase } from '../utils/supabase';

const UAZAPI_URL = process.env.UAZAP_API_URL || 'https://free.uazapi.com';
const UAZAPI_GLOBAL_KEY = process.env.UAZAP_API_KEY || ''; // O token global ou admin token da Uazapi

export const createInstance = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { tenantId, instanceName } = request.body as { tenantId: string, instanceName: string };

    // 1. Checar limite de instâncias no Supabase
    const { data: limitData } = await supabase
      .from('tenant_limits')
      .select('max_whatsapp_instances')
      .eq('tenant_id', tenantId)
      .single();

    const maxInstances = limitData?.max_whatsapp_instances || 1;

    const { count: currentInstances } = await supabase
      .from('whatsapp_instances')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId);

    if (currentInstances !== null && currentInstances >= maxInstances) {
      return reply.status(403).send({ 
        error: 'Limite atingido', 
        message: `Seu plano permite no máximo ${maxInstances} instância(s) de WhatsApp.` 
      });
    }

    // 2. Criar a instância no banco de dados para gerar o ID e token
    const { data: newInstance, error: dbError } = await supabase
      .from('whatsapp_instances')
      .insert({
        tenant_id: tenantId,
        instance_name: instanceName,
        status: 'connecting'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 3. Chamar a Uazapi para criar a instância (se for Evolution API, por exemplo, ele cria)
    // OBS: O payload exato depende de como sua Uazapi (ou Evolution) está configurada
    try {
      const uazapiResponse = await axios.post(`${UAZAPI_URL}/instance/create`, {
        instanceName: newInstance.id, // Usamos o ID do banco como nome da instância na Uazapi
        token: newInstance.id,
        webhook: `${process.env.BACKEND_URL}/api/webhooks/uazap/${newInstance.id}`
      }, {
        headers: {
          'apikey': UAZAPI_GLOBAL_KEY, // ou admintoken, dependendo da versão
          'Content-Type': 'application/json'
        }
      });

      // 4. Retornar o QRCode ou os dados da instância
      return reply.send({ 
        success: true, 
        instance: newInstance, 
        uazapi: uazapiResponse.data 
      });

    } catch (apiError: any) {
      // Se falhar na Uazapi, removemos do banco
      await supabase.from('whatsapp_instances').delete().eq('id', newInstance.id);
      throw new Error(`Falha na Uazapi: ${apiError.response?.data?.message || apiError.message}`);
    }

  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({ error: error.message });
  }
};

export const listInstances = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { tenantId } = request.params as { tenantId: string };

    const { data: instances, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) throw error;

    return reply.send({ instances });
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
};
