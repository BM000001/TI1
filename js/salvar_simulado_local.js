// Mantém a geração original de questões; adiciona somente persistência local.
(function () {
  const form = document.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const quantidade = Number(data.get('quantidade'));
    const materias = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    if (!materias.length) { alert('Selecione pelo menos uma matéria.'); return; }
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 100) {
      alert('Informe uma quantidade entre 1 e 100 questões.'); return;
    }
    const questoes = [];
    for (let i = 1; i <= quantidade; i++) {
      const enunciado = String(data.get('enunciado_' + i) || '').trim();
      const alternativas = Object.fromEntries(['A','B','C','D'].map(letra => [letra, String(data.get('resposta' + letra + '_' + i) || '').trim()]));
      const correta = String(data.get('alternativa_correta_' + i) || '');
      if (!enunciado || Object.values(alternativas).some(resposta => !resposta) || !['A','B','C','D'].includes(correta)) {
        alert('Preencha todas as questões e marque a alternativa correta.'); return;
      }
      questoes.push({ numero: i, enunciado, alternativas, correta });
    }
    const simulado = {
      id: Date.now().toString(36),
      nome: String(data.get('nome_simulado') || '').trim(),
      materias,
      quantidade,
      tempo: Number(data.get('tempo')),
      questoes,
      criadoEm: new Date().toISOString()
    };
    if (!simulado.nome || !Number.isFinite(simulado.tempo) || simulado.tempo <= 0) {
      alert('Preencha o nome e um tempo válido.'); return;
    }
    const chave = 'pontoEduSimuladosV1';
    try {
      const anteriores = JSON.parse(localStorage.getItem(chave) || '[]');
      if (!Array.isArray(anteriores)) throw new Error('Formato inválido');
      // Cada simulado é um objeto separado na lista, com ID próprio.
      const atualizados = [...anteriores, simulado];
      localStorage.setItem(chave, JSON.stringify(atualizados));
      alert('Simulado salvo com ' + questoes.length + ' questão(ões) e quatro alternativas por questão.');
    } catch (erro) {
      alert('Não foi possível salvar. Verifique o armazenamento do navegador.');
      console.error('Falha ao salvar simulado:', erro);
    }
  });
})();
