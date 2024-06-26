document.addEventListener('DOMContentLoaded', function () {

   

const addHome = document.getElementById('faq-home');


async function getPerguntas() {

    const url = 'https://pinhomultimidias.azurewebsites.net/duvida';
    
    try {
        const response = await axios.get(url);
        const perguntas = response.data;

        perguntas.forEach(pergunta => {
        addHome.innerHTML += `
        <details>
            <summary>${pergunta.pergunta}</summary>
            <p>${pergunta.resposta}</p>
        </details>
        `;
        }
    );
    } catch (error) {
        console.error('Erro ao obter perguntas:', error);
    }

}

getPerguntas();

});
