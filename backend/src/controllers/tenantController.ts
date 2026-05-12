import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../utils/supabase';

export const getTenants = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*');

    if (error) throw error;

    return reply.send({ success: true, data });
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({ success: false, error: error.message });
  }
};
