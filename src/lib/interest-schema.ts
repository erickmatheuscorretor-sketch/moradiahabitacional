import { z } from 'zod';

export const states = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'] as const;
export const employmentOptions = ['Empregado(a) com carteira','Autônomo(a)','Empregado(a) sem carteira','Servidor(a) público(a)','Aposentado(a) / pensionista','Desempregado(a)','Outro'] as const;
export const interestSchema = z.object({
  full_name: z.string().trim().min(3, 'Informe seu nome completo.').max(120),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida.').refine(v => { const d = new Date(v + 'T00:00:00Z'); return !isNaN(d.getTime()) && d.toISOString().slice(0,10) === v && d <= new Date() && d.getUTCFullYear() >= 1900; }, 'Informe uma data de nascimento válida.'),
  phone: z.string().transform(v => v.replace(/\D/g, '')).pipe(z.string().regex(/^[1-9]{2}\d{8,9}$/, 'Informe o WhatsApp com DDD.')),
  email: z.string().trim().email('Informe um e-mail válido.').max(255),
  city: z.string().trim().min(2, 'Informe sua cidade.').max(100),
  state: z.enum(states),
  income: z.coerce.number().min(0).max(100000000),
  employment: z.enum(employmentOptions),
  owns_home: z.boolean(),
  household_count: z.coerce.number().int().min(0).max(100),
  consent: z.literal(true, { errorMap: () => ({message: 'Autorize o tratamento dos dados para enviar.'}) }),
  utms: z.object({ utm_source: z.string().max(200).optional(), utm_medium: z.string().max(200).optional(), utm_campaign: z.string().max(200).optional(), utm_content: z.string().max(200).optional(), utm_term: z.string().max(200).optional() }).default({}),
});
export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 3) return digits;
  const tail = digits.slice(2);
  const split = digits.length > 10 ? 5 : 4;
  return `(${digits.slice(0,2)}) ${tail.slice(0,split)}${tail.length > split ? '-' + tail.slice(split) : ''}`;
}