// Dados das categorias e valores
const categoriasPrecos = {
    'A': {
        itens: [
            { descricao: 'Taxa de Inscrição', valor: 150.00 },
            { descricao: 'Exame Médico', valor: 90.00 },
            { descricao: 'Exame Psicotécnico', valor: 100.00 },
            { descricao: 'Material Didático', valor: 120.00 },
            { descricao: 'Aulas Teóricas', valor: 400.00 },
            { descricao: 'Aulas Práticas Moto', valor: 600.00 }
        ],
        desconto: 0.10 // 10% de desconto
    },
    'B': {
        itens: [
            { descricao: 'Taxa de Inscrição', valor: 150.00 },
            { descricao: 'Exame Médico', valor: 90.00 },
            { descricao: 'Exame Psicotécnico', valor: 100.00 },
            { descricao: 'Material Didático', valor: 120.00 },
            { descricao: 'Aulas Teóricas', valor: 400.00 },
            { descricao: 'Aulas Práticas Carro', valor: 800.00 }
        ],
        desconto: 0.10
    },
    'AB': {
        itens: [
            { descricao: 'Taxa de Inscrição', valor: 150.00 },
            { descricao: 'Exame Médico', valor: 90.00 },
            { descricao: 'Exame Psicotécnico', valor: 100.00 },
            { descricao: 'Material Didático', valor: 120.00 },
            { descricao: 'Aulas Teóricas', valor: 400.00 },
            { descricao: 'Aulas Práticas Moto', valor: 600.00 },
            { descricao: 'Aulas Práticas Carro', valor: 800.00 }
        ],
        desconto: 0.15 // 15% de desconto para categoria AB
    }
};

// Configurações de parcelamento
const parcelamentoConfig = {
    maxParcelas: 12,
    juros: 0.0199 // 1.99% ao mês
};

// Função para formatar valores em reais
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para calcular valor total
function calcularTotal(categoria) {
    return categoriasPrecos[categoria].itens.reduce((total, item) => total + item.valor, 0);
}

// Função para calcular valor com desconto
function calcularValorComDesconto(valorTotal, categoria) {
    const desconto = categoriasPrecos[categoria].desconto;
    return valorTotal * (1 - desconto);
}

// Função para calcular parcelas com juros
function calcularParcelas(valor) {
    const parcelas = [];
    for (let i = 1; i <= parcelamentoConfig.maxParcelas; i++) {
        if (i === 1) {
            parcelas.push({
                numeroParcelas: 1,
                valorParcela: valor,
                valorTotal: valor
            });
        } else {
            // Cálculo de juros compostos
            const valorTotal = valor * Math.pow(1 + parcelamentoConfig.juros, i);
            parcelas.push({
                numeroParcelas: i,
                valorParcela: valorTotal / i,
                valorTotal: valorTotal
            });
        }
    }
    return parcelas;
}

// Função para criar e animar cards de custos
function criarCardCusto(item, index) {
    const card = document.createElement('div');
    card.className = 'custo-card';
    card.innerHTML = `
        <div class="descricao">${item.descricao}</div>
        <div class="valor">${formatarMoeda(item.valor)}</div>
    `;
    
    // Adiciona delay na animação baseado no índice
    setTimeout(() => {
        card.classList.add('visible');
    }, index * 100);
    
    return card;
}

// Função para renderizar simulação
function renderizarSimulacao(categoria) {
    const resultadoDiv = document.getElementById('resultado-simulacao');
    const valorTotal = calcularTotal(categoria);
    const valorComDesconto = calcularValorComDesconto(valorTotal, categoria);
    const parcelas = calcularParcelas(valorTotal);

    // Limpa o conteúdo anterior
    resultadoDiv.innerHTML = '';

    // Cria container para os cards de custos
    const custosGrid = document.createElement('div');
    custosGrid.className = 'custos-grid';

    // Adiciona cards de custos com animação
    categoriasPrecos[categoria].itens.forEach((item, index) => {
        const card = criarCardCusto(item, index);
        custosGrid.appendChild(card);
    });

    // Cria seção de totais
    const totaisDiv = document.createElement('div');
    totaisDiv.className = 'totais';
    totaisDiv.innerHTML = `
        <div class="total-item">
            <span class="label">Valor Total:</span>
            <span class="valor">${formatarMoeda(valorTotal)}</span>
        </div>
        <div class="total-item destaque">
            <span class="label">Valor à Vista (${categoriasPrecos[categoria].desconto * 100}% de desconto):</span>
            <span class="valor">${formatarMoeda(valorComDesconto)}</span>
        </div>
        <div class="formas-pagamento">
            <h4>Opções de Parcelamento:</h4>
            <div class="select-container">
                <select id="select-parcelas" class="select-parcelas">
                    ${parcelas.map(parcela => `
                        <option value="${parcela.numeroParcelas}">
                            ${parcela.numeroParcelas}x de ${formatarMoeda(parcela.valorParcela)} 
                            (Total: ${formatarMoeda(parcela.valorTotal)})
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="pagamento-icons">
                <i class="fas fa-credit-card" title="Cartão de Crédito"></i>
                <i class="fas fa-money-bill-wave" title="Dinheiro"></i>
                <i class="fas fa-barcode" title="Boleto"></i>
                <i class="fab fa-pix" title="PIX"></i>
            </div>
        </div>
    `;

    // Adiciona os elementos ao resultado
    resultadoDiv.appendChild(custosGrid);
    resultadoDiv.appendChild(totaisDiv);

    // Adiciona classe para mostrar com animação
    setTimeout(() => {
        totaisDiv.classList.add('visible');
    }, (categoriasPrecos[categoria].itens.length + 1) * 100);
}

// Função para controlar o accordion de dúvidas
function setupAccordion() {
    const duvidasItems = document.querySelectorAll('.duvida-pergunta');
    
    duvidasItems.forEach(item => {
        item.addEventListener('click', function() {
            const resposta = this.nextElementSibling;
            const isActive = resposta.classList.contains('active');
            
            // Fecha todas as respostas
            document.querySelectorAll('.duvida-resposta').forEach(r => {
                r.classList.remove('active');
                r.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
            });

            // Se não estava ativo, abre a resposta clicada
            if (!isActive) {
                resposta.classList.add('active');
                this.querySelector('i').style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Setup inicial quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Setup dos cards de categoria
    const categoriaCards = document.querySelectorAll('.categoria-card');
    categoriaCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove seleção anterior
            categoriaCards.forEach(c => c.classList.remove('selected'));
            // Adiciona seleção ao card clicado
            this.classList.add('selected');
            // Renderiza simulação
            const categoria = this.getAttribute('data-categoria');
            renderizarSimulacao(categoria);
        });
    });

    // Setup do accordion de dúvidas
    setupAccordion();

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de scroll para mostrar elementos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observa elementos que devem animar ao scroll
    document.querySelectorAll('.duvida-item, .info-item').forEach(el => {
        observer.observe(el);
    });
});