import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { ArrowRight, LockKeyhole, CircleCheck, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { interestSchema, maskPhone, states, employmentOptions } from '@/lib/interest-schema';
import { submitInterest } from '@/lib/interest.functions';

export function InterestForm() {
 const submit = useServerFn(submitInterest);
 const [phone,setPhone] = useState('');
 const [errors,setErrors] = useState<Record<string,string>>({});
 const [busy,setBusy] = useState(false);
 const [success,setSuccess] = useState(false);
 async function onSubmit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const params = new URLSearchParams(window.location.search);
  const utms = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(k => params.has(k)).map(k => [k,params.get(k)?.slice(0,200)]));
  const input = { full_name:values.get('full_name'), birth_date:values.get('birth_date'), phone, email:values.get('email'), city:values.get('city'), state:values.get('state'), income:values.get('income'), employment:values.get('employment'), owns_home:values.get('owns_home')==='yes', household_count:values.get('household_count'), consent:values.get('consent')==='on',utms };
  const parsed = interestSchema.safeParse(input);
  if(!parsed.success) { setErrors(Object.fromEntries(parsed.error.issues.map(i => [String(i.path[0]),i.message]))); return; }
  setErrors({}); setBusy(true);
  try { await submit({data:parsed.data}); setSuccess(true); document.getElementById('cadastro')?.scrollIntoView({behavior:'smooth'}); window.dispatchEvent(new CustomEvent('moradia:lead', {detail:{event:'Lead'}})); }
  catch { setErrors({submit:'Não foi possível enviar. Seus dados continuam preenchidos; tente novamente.'}); }
  finally { setBusy(false); }
 }
 const error = (name:string) => errors[name] ? <span className="field-error" role="alert">{errors[name]}</span> : null;
 if(success) return <div className="interest-form success" role="status"><CircleCheck size={56}/><h3>Interesse cadastrado!</h3><p>Obrigado pelo interesse! Seu cadastro foi recebido com segurança.</p><p>Este registro é independente e não constitui inscrição em programa habitacional. Não há cobrança nesta página, garantia de imóvel ou aprovação.</p><Button asChild variant="outline"><a href="https://www.gov.br/cidades/pt-br/assuntos/minha-casa-minha-vida" target="_blank" rel="noopener noreferrer">Consultar informações oficiais <ArrowRight/></a></Button></div>;
 return <form className="interest-form" onSubmit={onSubmit}><div className="form-title"><h3>Seu próximo passo começa aqui</h3><span>* Campos obrigatórios</span></div><div className="fields-grid">
 <div className="field field-wide"><label htmlFor="full_name">Nome completo *</label><input id="full_name" name="full_name" placeholder="Como você se chama?" autoComplete="name" maxLength={120} required/>{error('full_name')}</div>
 <div className="field"><label htmlFor="birth_date">Data de nascimento *</label><input id="birth_date" name="birth_date" type="date" required/>{error('birth_date')}</div>
 <div className="field"><label htmlFor="phone">WhatsApp com DDD *</label><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" value={phone} onChange={e=>setPhone(maskPhone(e.target.value))} required/>{error('phone')}</div>
 <div className="field field-wide"><label htmlFor="email">E-mail *</label><input id="email" name="email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" maxLength={255} required/>{error('email')}</div>
 <div className="field"><label htmlFor="city">Cidade *</label><input id="city" name="city" autoComplete="address-level2" placeholder="Sua cidade" maxLength={100} required/>{error('city')}</div>
 <div className="field"><label htmlFor="state">Estado *</label><select id="state" name="state" autoComplete="address-level1" required defaultValue=""><option value="" disabled>Selecione</option>{states.map(s=><option key={s}>{s}</option>)}</select>{error('state')}</div>
 <div className="field"><label htmlFor="income">Renda familiar mensal (R$) *</label><input id="income" name="income" type="number" inputMode="decimal" min="0" max="100000000" step="0.01" placeholder="0,00" required/>{error('income')}</div>
 <div className="field"><label htmlFor="employment">Situação profissional *</label><select id="employment" name="employment" required defaultValue=""><option value="" disabled>Selecione</option>{employmentOptions.map(s=><option key={s}>{s}</option>)}</select>{error('employment')}</div>
 <div className="field"><label htmlFor="owns_home">Possui imóvel próprio? *</label><select id="owns_home" name="owns_home" required defaultValue=""><option value="" disabled>Selecione</option><option value="no">Não</option><option value="yes">Sim</option></select></div>
 <div className="field"><label htmlFor="household_count">Pessoas que moram com você *</label><input id="household_count" name="household_count" type="number" min="0" max="100" inputMode="numeric" placeholder="Sem contar você" required/>{error('household_count')}</div>
 </div><label className="consent"><input type="checkbox" name="consent" required/><span>Autorizo o tratamento dos meus dados para receber informações sobre moradia, conforme a <Link to="/privacidade">Política de Privacidade</Link>. Sei que este cadastro não é uma inscrição oficial.</span></label>{error('consent')}{error('submit')}<Button variant="campaign" className="submit-button" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="animate-spin"/> Enviando cadastro...</> : <>CADASTRAR MEU INTERESSE <ArrowRight/></>}</Button><p className="form-security"><LockKeyhole size={12}/> Seus dados são tratados com segurança.</p><p className="form-disclaimer">Cadastro gratuito e informativo. Sem garantia de aprovação ou imóvel.</p></form>;
}
