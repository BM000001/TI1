/* Ponto Edu: protótipo local. Dados ficam neste navegador, não são enviados a servidor. */
const DB_KEY = 'pontoEduV1';
function readDB() { try { const x=JSON.parse(localStorage.getItem(DB_KEY)||'{}'); return {exercicios:[],simulados:[],redacoes:[],...x}; } catch { return {exercicios:[],simulados:[],redacoes:[]}; } }
function saveItem(tipo,item) { const db=readDB(); db[tipo].push({...item,id:Date.now().toString(36)+Math.random().toString(36).slice(2),criadoEm:new Date().toISOString()}); localStorage.setItem(DB_KEY,JSON.stringify(db)); }
function setupForm(tipo) {
 const form=document.querySelector('form'); if(!form)return;
 form.removeAttribute('action'); form.removeAttribute('method');
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  if(tipo==='redacoes'){
   const arquivo=document.getElementById('arquivo-redacao')?.files?.[0];
   if(!String(data.texto_redacao||'').trim()&&!arquivo){alert('Digite uma redação ou selecione um arquivo.');return;}
   if(arquivo){alert('Arquivos não são enviados nesta versão local. Digite o texto para salvá-lo e revisá-lo.');return;}
   delete data.arquivo_redacao;
  }
  if(tipo==='simulados'){
   data.questoes=Array.from({length:Number(data.quantidade)||0},(_,i)=>{const n=i+1;return {enunciado:data['enunciado_'+n],respostas:['A','B','C','D'].map(k=>data['resposta'+k+'_'+n]),correta:data['alternativa_correta_'+n]};});
   if(!data.questoes.length||data.questoes.some(q=>!q.enunciado||q.respostas.some(v=>!v)||!q.correta)){alert('Preencha todas as questões.');return;}
  }
  saveItem(tipo,data); alert('Salvo neste navegador. Os dados não são sincronizados com outros aparelhos.');form.reset();
 });
}
function renderRedacoes(){
 const painel=document.querySelector('.painel');if(!painel)return;
 const items=readDB().redacoes; painel.querySelector('.badge').textContent=items.length+' disponíveis';
 const empty=painel.querySelector('.empty-state');if(empty)empty.hidden=items.length>0;
 const lista=document.createElement('div');lista.className='lista-redacoes';
 items.forEach(item=>{const article=document.createElement('article');article.style.cssText='padding:16px;margin:12px 0;border:1px solid #ddd;border-radius:12px;white-space:pre-wrap';const h=document.createElement('h3');h.textContent='Tema: '+item.tema;const p=document.createElement('p');p.textContent=item.texto_redacao||'';article.append(h,p);lista.append(article);});painel.append(lista);
}
function renderRelatorio(){
 const cards=document.querySelectorAll('.cards .valor');if(cards.length<4)return;
 const db=readDB();cards[0].textContent='0';cards[1].textContent='0';cards[2].textContent='0';cards[3].textContent='—';
 const resumo=document.querySelector('.section');if(resumo){const note=document.createElement('p');note.textContent='Relatório de demonstração: ainda não existe módulo de resolução e correção automática. Os indicadores acima começam em zero.';resumo.prepend(note);}
 document.querySelectorAll('.materia').forEach(el=>{el.dataset.status='Não iniciada';el.dataset.questoes='0/0';el.dataset.acerto='—';el.dataset.obs='Sem resultados registrados';const bar=el.querySelector('.barra span');if(bar)bar.style.width='0%';const meta=el.querySelectorAll('.meta span');if(meta[0])meta[0].textContent='0/0';if(meta[1])meta[1].textContent='—';const status=el.querySelector('.status');if(status)status.textContent='Não iniciada';});
}
