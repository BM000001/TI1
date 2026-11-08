(() => {
  const page = document.body.dataset.pontoedu;
  const form = document.querySelector('main form');
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  const list = document.createElement('section');
  const anchor = form || document.querySelector('.painel');
  anchor.after(status, list);
  const keys = { questoes: 'pontoedu.questoes', simulados: 'pontoedu.simulados', redacoes: 'pontoedu.redacoes' };
  const load = key => {
    const records = JSON.parse(localStorage.getItem(key) ?? '[]');
    if (!Array.isArray(records)) throw new Error('Formato de dados incompatível.');
    return records;
  };
  const save = (key, records) => localStorage.setItem(key, JSON.stringify(records));
  const id = () => crypto.randomUUID();
  function run(action) {
    try { action(); } catch (error) { status.textContent = error.message; }
  }
  function show(parent, tag, text) {
    const node = document.createElement(tag);
    node.textContent = text;
    parent.append(node);
    return node;
  }
  function button(parent, label, action) {
    const node = show(parent, 'button', label);
    node.type = 'button';
    node.addEventListener('click', () => run(action));
    return node;
  }
  if (page === 'questoes' || page === 'simulados') {
    const key = keys[page];
    function render() {
      list.replaceChildren();
      show(list, 'h2', page === 'questoes' ? 'Questões cadastradas' : 'Simulados cadastrados');
      const records = load(key);
      if (!records.length) show(list, 'p', 'Nenhum cadastro.');
      for (const record of records) {
        const row = show(list, 'p', record.enunciado ?? record.nome);
        button(row, 'Excluir', () => {
          if (!confirm('Excluir este cadastro?')) return;
          if (page === 'questoes' && load(keys.simulados).some(simulado => simulado.questaoIds?.includes(record.id))) {
            throw new Error('A questão faz parte de um simulado. Exclua o simulado antes.');
          }
          save(key, load(key).filter(item => item.id !== record.id));
          render();
        });
      }
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      run(() => {
        const data = new FormData(form);
        const get = name => String(data.get(name) ?? '').trim();
        let record;
        if (page === 'questoes') {
          const materia = get('materia');
          const conteudo = get('produto');
          const enunciado = get('enunciado');
          const alternativas = ['resposta', 'respostaB', 'respostaC', 'respostaD'].map(get);
          const correta = get('alternativa_correta');
          if (!materia || !conteudo || !enunciado || alternativas.some(value => !value) || !['A','B','C','D'].includes(correta)) {
            throw new Error('Preencha a matéria, o conteúdo, o enunciado e as alternativas e marque a correta.');
          }
          record = { id: id(), materia, conteudo, enunciado, alternativas, correta };
        } else {
          const nome = get('nome_simulado');
          const quantidade = Number(get('quantidade'));
          const tempo = Number(get('tempo'));
          const materias = [...form.querySelectorAll('input[type="checkbox"]:checked')].map(input => input.value);
          if (!nome || !materias.length || !Number.isInteger(quantidade) || quantidade < 1 || !Number.isInteger(tempo) || tempo < 1) {
            throw new Error('Informe o nome, ao menos uma matéria, quantidade e tempo válidos.');
          }
          const questoes = load(keys.questoes).filter(questao => materias.includes(questao.materia));
          if (questoes.length < quantidade) throw new Error('Cadastre mais questões nas matérias selecionadas.');
          record = { id: id(), nome, materias, quantidade, tempo, questaoIds: questoes.slice(0, quantidade).map(questao => questao.id) };
        }
        save(key, [...load(key), record]);
        form.reset();
        form.querySelector('#materia')?.dispatchEvent(new Event('change'));
        render();
        status.textContent = 'Cadastro salvo.';
      });
    });
    run(render);
  }
  if (page === 'redacao') {
    const tema = form.querySelector('#tema');
    const texto = form.querySelector('#texto-redacao');
    const sessao = JSON.parse(localStorage.getItem('pontoedu.sessao') ?? 'null');
    const aluno = sessao?.id ?? sessao?.email ?? 'local';
    const count = show(texto.parentElement, 'p', '');
    const updateCount = () => {
      const value = texto.value.trim();
      const lines = value ? value.split('\n').length : 0;
      const words = value ? value.split(/\s+/).length : 0;
      count.textContent = lines + ' linhas · ' + words + ' palavras';
      return lines;
    };
    function persist(enviar) {
      const lines = updateCount();
      if (enviar && (!tema.value || !texto.value.trim() || lines > 30)) throw new Error('Escolha o tema e escreva de 1 a 30 linhas.');
      const records = load(keys.redacoes);
      const draft = records.find(item => item.aluno === aluno && item.status === 'rascunho');
      const entry = { id: draft?.id ?? id(), aluno, tema: tema.value, texto: texto.value, status: enviar ? 'enviada' : 'rascunho' };
      save(keys.redacoes, [...records.filter(item => item.id !== entry.id), entry]);
      if (enviar) { form.reset(); updateCount(); }
      status.textContent = enviar ? 'Redação enviada.' : 'Rascunho salvo.';
    }
    button(form, 'Salvar rascunho', () => persist(false));
    form.addEventListener('submit', event => { event.preventDefault(); run(() => persist(true)); });
    texto.addEventListener('input', updateCount);
    run(() => {
      const draft = load(keys.redacoes).find(item => item.aluno === aluno && item.status === 'rascunho');
      if (draft) { tema.value = draft.tema; texto.value = draft.texto; }
      updateCount();
    });
  }
  if (page === 'correcao') {
    function render() {
      list.replaceChildren();
      const records = load(keys.redacoes).filter(item => ['enviada','corrigida'].includes(item.status));
      anchor.querySelector('.badge').textContent = records.length + ' disponíveis';
      anchor.querySelector('.empty-state').hidden = records.length > 0;
      for (const record of records) {
        const card = show(list, 'article', '');
        show(card, 'h3', record.tema + ' · ' + record.aluno);
        show(card, 'pre', record.texto).style.whiteSpace = 'pre-wrap';
        const review = show(card, 'form', '');
        const scores = Array.from({ length: 5 }, (_, index) => {
          const label = show(review, 'label', 'Competência ' + (index + 1) + ' ');
          const field = show(label, 'input', '');
          Object.assign(field, { type: 'number', min: '0', max: '200', step: '40', required: true, value: record.competencias?.[index] ?? '' });
          return field;
        });
        show(review, 'button', 'Salvar correção').type = 'submit';
        if (record.status === 'corrigida') show(card, 'p', 'Nota: ' + record.nota);
        review.addEventListener('submit', event => {
          event.preventDefault();
          run(() => {
            const competencias = scores.map(field => field.valueAsNumber);
            const nota = competencias.reduce((total, score) => total + score, 0);
            save(keys.redacoes, load(keys.redacoes).map(item => item.id === record.id ? { ...item, competencias, nota, status: 'corrigida' } : item));
            render();
            status.textContent = 'Correção salva.';
          });
        });
      }
    }
    run(render);
  }
})();
