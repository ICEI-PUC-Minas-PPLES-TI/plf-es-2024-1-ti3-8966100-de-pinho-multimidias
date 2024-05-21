// Variáveis do filtro
var formFiltro = document.getElementById("filtroCarros");
var btnPesquisar = document.getElementById("botao-pesquisar-filtro");
var marcaCarro = document.getElementById("marcaCarro");
var modeloCarro = document.getElementById('modeloCarro');
var anoCarro = document.getElementById('anoModelo');
var comandoVolante = document.getElementById('comando-volante');
var radioOriginal = document.getElementById('radio-original');
var telaProdutos = document.getElementById('tela-produtos');

// Carregar o carrinho do localStorage ou inicializar um novo
var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Endpoint
var urledicaoFiltrocarros = "http://127.0.0.1:8080/produto/filtro";

async function getProdutosFiltrados() {
    try {
        const marca = marcaCarro.value;
        const modelo = modeloCarro.value;
        const ano = anoCarro.value;
        const comando = comandoVolante.checked;
        const radio = radioOriginal.checked;

        const response = await axios.get(urledicaoFiltrocarros, {
            params: {
                possuiComandoVolante: comando,
                possuiRadioOriginal: radio,
                marca: marca,
                ano: ano,
                modelo: modelo
            }
        });

        const produtosFiltrados = response.data;

        if (!Array.isArray(produtosFiltrados) || produtosFiltrados.length === 0) {
            telaProdutos.innerHTML = `
              <div class="alert alert-warning" role="alert">
                Nenhum produto encontrado. Pesquise novamente!
              </div>
            `;
            return;
        }
        const produtosCombinados = combinarProdutos(produtosFiltrados);

        telaProdutos.innerHTML = "";
        produtosCombinados.forEach(produto => {
            telaProdutos.innerHTML += `
    <div class="col-lg-3 col-md-6 col-sm-6 d-flex">
        <div class="card w-100 my-2 shadow-2-strong">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBK_T0Czsqal3dhSALYalAHdYdbZwRYryKBUGE7S9BBg&s" class="card-img-top" style="aspect-ratio: 1 / 1" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${produto.nome}</h5>
            <p class="card-text">Ano: ${produto.anoInicio} - ${produto.anoFim}</p>
            <p class="card-text">Preço: R$${produto.preco}</p>
            <div class="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto">
              <button id="btn-carrinho" class="btn btn-primary shadow-0 me-1" codigo-produto="${produto.codigoProduto}" nome-produto="${produto.nome}" preco-produto="${produto.preco}" anoFim="${produto.anoFim}" anoInicio="${produto.anoInicio}">Adicionar ao Carrinho</button>
            </div>
          </div>
        </div>
    </div>`;
        });

        document.querySelectorAll('#btn-carrinho').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const codigoProduto = this.getAttribute('codigo-produto');
                const nome = this.getAttribute('nome-produto');
                const preco = parseFloat(this.getAttribute('preco-produto'));
                const anoInicio = this.getAttribute('anoInicio');
                const anoFim = this.getAttribute('anoFim');
                const quantidade = "1";

                // Adicionar o novo produto ao carrinho existente
                carrinho.push({ codigoProduto, nome, preco, quantidade, anoInicio, anoFim });

                // Salvar o carrinho atualizado no localStorage
                localStorage.setItem('carrinho', JSON.stringify(carrinho));

                // Redirecionar para a página do carrinho
                alert('Produto adicionado ao carrinho!');
                window.location.href = "carrinho.html";
            });
        });
        return response.data;
    } catch (error) {
        console.log("Erro ao obter produtos filtrados", error);
    }
}
function combinarProdutos(produtos) {
    const combinados = [];

    produtos.forEach(produto => {
        let combinado = combinados.find(p => p.anoInicio === produto.anoInicio && p.anoFim === produto.anoFim);

        if (!combinado) {
            combinado = { ...produto, quantidade: 1 };
            combinados.push(combinado);
        } else {
            combinado.preco += produto.preco;
            combinado.quantidade += 1;
        }
    });

    console.log(combinados, "combinados");

    return combinados;
}

btnPesquisar.addEventListener("click", function (e) {
    e.preventDefault();
    getProdutosFiltrados();
});

