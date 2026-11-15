import { createServerFn } from '@tanstack/react-start';
import { interestSchema } from './interest-schema';

export const submitInterest = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => interestSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('housing_interest').insert(data);
    if (error) throw new Error('Não foi possível salvar seu cadastro. Tente novamente.');
    return { success: true };
  });