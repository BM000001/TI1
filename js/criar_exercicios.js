const opcoesPorMateria = {
  matematica: ["Álgebra", "Geometria", "Trigonometria"],
  portugues: ["Interpretação de Texto", "Gramática", "Redação"],
  historia: ["Idade Média", "Brasil Império", "Revolução Francesa"],
  biologia: ["Células", "Genética", "Ecologia"],
  fisica: ["Movimento", "Eletricidade", "Energia"],
  geografia: ["Mapas", "Climas", "Urbanização"]
};

// Renomeado para fazer mais sentido com o tema de estudos
const selectMateria = document.getElementById('materia');
const selectConteudo = document.getElementById('produto'); // Mantenha 'produto' se o ID do HTML for esse

if (selectMateria && selectConteudo) {
  
  const atualizarConteudos = () => {
    const materia = selectMateria.value;
    const listaConteudos = opcoesPorMateria[materia];


    // Gera todas as <option> de uma vez só usando map e join
    const optionsHTML = listaConteudos.map(item => {
      // Cria o valor limpo (sem acento, minúsculo e com hífen)
      const value = item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      return `<option value="${value}">${item}</option>`;
    }).join('');

    // Injeta o HTML completo de uma vez (melhor performance)
    selectConteudo.innerHTML = optionsHTML;
    selectConteudo.disabled = false;
  };

  selectMateria.addEventListener('change', atualizarConteudos);
}
