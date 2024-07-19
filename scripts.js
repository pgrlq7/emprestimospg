// Função para mostrar uma seção específica
function showSection(sectionId) {
    const sections = ['home', 'lista', 'pagos'];
    sections.forEach(id => {
        document.getElementById(id).style.display = (id === sectionId) ? 'block' : 'none';
    });
}

// Função para adicionar um empréstimo
function adicionarEmprestimo() {
    const nome = document.getElementById('nome').value;
    const valorEmprestado = parseFloat(document.getElementById('valorEmprestado').value);
    const valorRecebido = parseFloat(document.getElementById('valorRecebido').value);
    const mensagemErro = document.getElementById('mensagemErro');
    const mensagemSucesso = document.getElementById('mensagemSucesso');
    const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];

    if (nome && !isNaN(valorEmprestado) && !isNaN(valorRecebido)) {
        if (valorEmprestado > valorRecebido) {
            mensagemErro.textContent = 'O valor emprestado não pode ser maior que o valor a receber!';
            return;
        }
        emprestimos.push({ nome, valorEmprestado, valorRecebido, pago: false });
        localStorage.setItem('emprestimos', JSON.stringify(emprestimos));
        mensagemSucesso.textContent = 'Empréstimo adicionado com sucesso!';
        mensagemErro.textContent = ''; // Limpa a mensagem de erro
        setTimeout(() => mensagemSucesso.textContent = '', 5000);
        atualizarLista();
    } else {
        mensagemErro.textContent = 'Preencha todos os campos corretamente!';
    }
}

// Função para remover um empréstimo da lista
function removerEmprestimo(index) {
    const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];

    if (index >= 0 && index < emprestimos.length) {
        emprestimos.splice(index, 1); // Remove o empréstimo do array
        localStorage.setItem('emprestimos', JSON.stringify(emprestimos));
        atualizarLista(); // Atualiza a lista após remover
    }
}

// Função para remover todos os empréstimos
function removerTodosEmprestimos() {
    localStorage.removeItem('emprestimos');
    atualizarLista(); // Atualiza a lista após remover todos
}

// Função para filtrar os empréstimos
function filtrarEmprestimos() {
    const busca = document.getElementById('busca').value.toLowerCase();
    const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];
    const lista = document.getElementById('emprestimosLista');

    lista.innerHTML = emprestimos
      .filter(emprestimo => emprestimo.nome.toLowerCase().includes(busca))
      .map((emprestimo, index) => `
        <li class="${emprestimo.pago ? 'pago' : ''}">
          <strong>Nome:</strong> ${emprestimo.nome} <br>
          <strong>Emprestado:</strong> R$ ${emprestimo.valorEmprestado} <br>
          <strong>A Receber:</strong> R$ ${emprestimo.valorRecebido} <br>
          <button onclick="marcarComoPago(${index})" class="pago-btn">Marcar como Pago</button>
          <button onclick="removerEmprestimo(${index})" class="remover-btn">Remover</button>
        </li>
      `).join('');
}

// Função para marcar um empréstimo como pago
function marcarComoPago(index) {
    const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];
    if (index >= 0 && index < emprestimos.length) {
        emprestimos[index].pago = true; // Marca o empréstimo como pago
        localStorage.setItem('emprestimos', JSON.stringify(emprestimos));
        atualizarLista(); // Atualiza a lista após marcar como pago
    }
}

// Função para validar o campo Nome
function validarNome() {
    const nome = document.getElementById('nome').value;
    const mensagemErro = document.getElementById('mensagemErro');
    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/; // Expressão regular para letras e espaços

    if (!nomeRegex.test(nome)) {
        mensagemErro.textContent = 'O nome deve conter apenas letras e espaços!';
    } else {
        mensagemErro.textContent = ''; // Limpa a mensagem de erro
    }
}

// Função para atualizar a lista de empréstimos
function atualizarLista() {
    const emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];
    const lista = document.getElementById('emprestimosLista');
    const listaPagos = document.getElementById('pagosLista');

    lista.innerHTML = emprestimos
      .filter(emprestimo => !emprestimo.pago)
      .map((emprestimo, index) => `
        <li>
          <strong>Nome:</strong> ${emprestimo.nome} <br>
          <strong>Emprestado:</strong> R$ ${emprestimo.valorEmprestado} <br>
          <strong>A Receber:</strong> R$ ${emprestimo.valorRecebido} <br>
          <button onclick="marcarComoPago(${index})" class="pago-btn">Marcar como Pago</button>
          <button onclick="removerEmprestimo(${index})" class="remover-btn">Remover</button>
        </li>
      `).join('');

    listaPagos.innerHTML = emprestimos
      .filter(emprestimo => emprestimo.pago)
      .map((emprestimo, index) => `
        <li>
          <strong>Nome:</strong> ${emprestimo.nome} <br>
          <strong>Emprestado:</strong> R$ ${emprestimo.valorEmprestado} <br>
          <strong>A Receber:</strong> R$ ${emprestimo.valorRecebido} <br>
          <button onclick="removerEmprestimo(${index})" class="remover-btn">Remover</button>
        </li>
      `).join('');
}

// Inicializa a lista de empréstimos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    atualizarLista();
});
