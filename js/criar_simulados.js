const selectQuantidade = document.getElementById('quantidade');
const containerQuestoes = document.getElementById('container-questoes'); // Crie uma div vazia com esse ID no seu HTML

if (selectQuantidade && containerQuestoes) {
  
  const gerarCamposQuestoes = () => {
    // Pega o número digitado ou selecionado pelo usuário
    const quantidade = parseInt(selectQuantidade.value) || 0;
    

    let htmlQuestoes = '';

    // Loop que roda a quantidade de vezes que o usuário escolheu
    for (let i = 1; i <= quantidade; i++) {
      htmlQuestoes += `
        <div class='questao-bloco' style='margin-bottom: 40px; padding: 20px; border: 1px solid #E2E8F0; border-radius: 16px; background-color: #FFFFFF;'>
          <h3>Questão ${i}</h3>

          <div style='margin-bottom: 12px; display: flex; flex-direction: column;'>
            <label for='enunciado_${i}'>Enunciado:</label>
            <input type='text' id='enunciado_${i}' name='enunciado_${i}' placeholder='Digite o enunciado do exercício ${i}' required>
          </div>

          <div style='margin-bottom: 12px; display: flex; flex-direction: column;'>
            <label for='respostaA_${i}'>Resposta A:</label>
            <input type='text' id='respostaA_${i}' name='respostaA_${i}' placeholder='Digite a resposta A' required>
          </div>

          <div style='margin-bottom: 12px; display: flex; flex-direction: column;'>
            <label for='respostaB_${i}'>Resposta B:</label>
            <input type='text' id='respostaB_${i}' name='respostaB_${i}' placeholder='Digite a resposta B' required>
          </div>

          <div style='margin-bottom: 12px; display: flex; flex-direction: column;'>
            <label for='respostaC_${i}'>Resposta C:</label>
            <input type='text' id='respostaC_${i}' name='respostaC_${i}' placeholder='Digite a resposta C' required>
          </div>

          <div style='margin-bottom: 12px; display: flex; flex-direction: column;'>
            <label for='respostaD_${i}'>Resposta D:</label>
            <input type='text' id='respostaD_${i}' name='respostaD_${i}' placeholder='Digite a resposta D' required>
          </div>

          <div class='selecao-correta' style='margin-top: 20px; background-color: #F8FAFC; padding: 16px; border-radius: 12px;'>
            <p style='margin-top: 0; margin-bottom: 12px;'><strong>Qual das alternativas acima é a correta?</strong></p>
            
            <div style='display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;'>
              <div>
                <input type='radio' id='corretaA_${i}' name='alternativa_correta_${i}' value='A' required>
                <label for='corretaA_${i}'>Alternativa A</label>
              </div>
              <div>
                <input type='radio' id='corretaB_${i}' name='alternativa_correta_${i}' value='B'>
                <label for='corretaB_${i}'>Alternativa B</label>
              </div>
              <div>
                <input type='radio' id='corretaC_${i}' name='alternativa_correta_${i}' value='C'>
                <label for='corretaC_${i}'>Alternativa C</label>
              </div>
              <div>
                <input type='radio' id='corretaD_${i}' name='alternativa_correta_${i}' value='D'>
                <label for='corretaD_${i}'>Alternativa D</label>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Injeta todo o HTML gerado de uma vez só dentro do container
    containerQuestoes.innerHTML = htmlQuestoes;
  };

  // Dispara a função quando o usuário mudar a quantidade de questões
  selectQuantidade.addEventListener('change', gerarCamposQuestoes);
}