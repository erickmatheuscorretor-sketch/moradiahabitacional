import { describe, it, expect } from 'vitest';
import { interestSchema, maskPhone } from '@/lib/interest-schema';
const valid = { full_name:'Maria da Silva', birth_date:'1990-03-12',phone:'(11) 99999-9999',email:'maria@example.com',city:'São Paulo',state:'SP',income:2500,employment:'Autônomo(a)',owns_home:false,household_count:3,consent:true,utms:{utm_source:'meta'} };
describe('Interest rules',()=>{
 it('requires every requested profile field',()=>{for(const key of ['full_name','birth_date','phone','email','city','state','income','employment','owns_home','household_count']) {const data:Record<string,unknown>={...valid};delete data[key];expect(interestSchema.safeParse(data).success,key).toBe(false);}});
 it('requires consent to personal data treatment',()=>{expect(interestSchema.safeParse({...valid,consent:false}).success).toBe(false);});
 it('formats WhatsApp with DDD',()=>{expect(maskPhone('11999999999')).toBe('(11) 99999-9999');expect(interestSchema.parse(valid).phone).toBe('11999999999');});
 it('captures campaign UTMs without collecting unknown keys',()=>{expect(interestSchema.parse({...valid,utms:{utm_source:'meta',utm_campaign:'moradia2027',private:'ignored'}}).utms).toEqual({utm_source:'meta',utm_campaign:'moradia2027'});});
});