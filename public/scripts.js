// ini
// Inicializa o Socket.IO
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o Socket.IO
    const socket = io();

    // Ouvinte para o evento 'atualizar-status'
    socket.on('atualizar-status', (data) => {
        console.log('Atualizando status com dados:', data);
        document.getElementById('statusExecucao').textContent = data.status;
        document.getElementById('ultimaConsulta').textContent = `Última consulta: ${data.ultimaConsulta || 'Erro'}`;
        document.getElementById('proximaConsulta').textContent = `Próxima consulta: ${data.proximaConsulta || 'Erro'}`;
        const proximaConsultaDate = new Date(data.proximaConsulta);
        agendarProximaAtualizacao(proximaConsultaDate);
    });
});

// Função para agendar a próxima atualização
function agendarProximaAtualizacao(proximaConsulta) {
    const agora = new Date();
    if (proximaConsulta > agora) {
        const tempoRestante = proximaConsulta - agora;
        setTimeout(async () => {
            await atualizarStatus();
        }, tempoRestante);
    }
}

// Função para atualizar o status
async function atualizarStatus() {
    try {
        const response = await fetch('/api/datas-consulta');
        const data = await response.json();
        console.log('Dados recebidos no atualizarStatus:', data);
        document.getElementById('statusExecucao').textContent = data.status;
        document.getElementById('ultimaConsulta').textContent = `Última consulta: ${data.ultimaConsulta || 'Erro'}`;
        document.getElementById('proximaConsulta').textContent = `Próxima consulta: ${data.proximaConsulta || 'Erro'}`;
        const proximaConsultaDate = new Date(data.proximaConsulta);
        agendarProximaAtualizacao(proximaConsultaDate);
    } catch (error) {
        console.error('Erro ao obter status de consulta:', error);
    }
}

// Inicializa a atualização do status ao carregar a página
window.onload = async () => {
    await atualizarStatus();
};


//fim



// Função para formatar a data no formato 'DD/MM/YYYY'
function formatDateDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para formatar a data no formato 'YYYY-MM-DD' para inputs
function formatDateYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Variável para armazenar a lista de varas selecionadas
let varasSelecionadas = [];

// Função para atualizar as datas da última e próxima consulta
// function atualizarDatasConsulta() {
//     fetch('/api/datas-consulta') // Ajuste o endpoint da API conforme necessário
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById('ultimaConsulta').textContent = `Última consulta: ${data.ultimaConsulta || ''}`;
//             document.getElementById('proximaConsulta').textContent = `Próxima consulta: ${data.proximaConsulta || '-'}`;
//         })
//         .catch(error => {
//             console.error('Erro ao carregar datas de consulta:', error);
//             // document.getElementById('ultimaConsulta').textContent = 'Última consulta: -';
//             // document.getElementById('proximaConsulta').textContent = 'Próxima consulta: -';
//         });
// }

function extrairHora(dataHoraString) {
    // Divida a string em partes: data e hora
    const [_, hora] = dataHoraString.split(', ');
    // Retorne a hora no formato desejado
    return hora;
}


async function atualizarStatus() {
    try {
        const response = await fetch('/api/datas-consulta');
        if (!response.ok) {
            throw new Error(`Erro ao obter status de consulta: ${response.statusText}`);
        }
        const data = await response.json();

        console.log('Dados recebidos no atualizarStatus:', data);
        document.getElementById('statusExecucao').textContent = data.status;
        document.getElementById('ultimaConsulta').textContent = `Última consulta: ${extrairHora(data.ultimaConsulta)}`;
        document.getElementById('proximaConsulta').textContent = `Próxima consulta: ${extrairHora(data.proximaConsulta)}`;
        agendarProximaAtualizacao(data.proximaConsulta);
    } catch (error) {
        console.error('Erro ao obter status de consulta:', error);
    }
}

// check status a cada 5 segundos
//setInterval(atualizarStatus, 5000 * 12); // 1 min

window.onload = () => {
    atualizarStatus(); // Chama a função ao carregar a página

    // Código para inicialização do formulário e tooltips
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const startDateLabel = document.getElementById('startDateLabel');
    const endDateLabel = document.getElementById('endDateLabel');

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    startDateInput.value = formatDateYYYYMMDD(today);
    endDateInput.value = formatDateYYYYMMDD(tomorrow);

    startDateLabel.textContent = formatDateDDMMYYYY(today);
    endDateLabel.textContent = formatDateDDMMYYYY(tomorrow);
};


document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM carregado');

    // Atualiza as datas da última e próxima consulta
    try {
        const response = await fetch('/api/datas-consulta');
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da consulta');
        }
        const data = await response.json();
        console.log('Dados da consulta recebidos:', data);

        document.getElementById('ultimaConsulta').textContent = `Última consulta: ${data.ultimaConsulta || 'Erro'}`;
        document.getElementById('proximaConsulta').textContent = `Próxima consulta: ${data.proximaConsulta || 'Erro'}`;
    } catch (error) {
        console.error('Erro ao carregar datas de consulta:', error);
        document.getElementById('ultimaConsulta').textContent = 'Última consulta: Erro ao carregar';
        document.getElementById('proximaConsulta').textContent = 'Próxima consulta: Erro ao carregar';
    }

    // Código existente para carregar varas disponíveis
    try {
        const response = await fetch('/api/varas');
        if (!response.ok) {
            throw new Error('Erro ao buscar varas');
        }
        const varasDisponiveis = await response.json();
        console.log('Varas disponíveis recebidas:', varasDisponiveis);

        const dropdown = document.getElementById('dropdown');
        dropdown.innerHTML = ''; // Limpa o dropdown existente

        varasDisponiveis.forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.label;
            group.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                if (option.selected) {
                    opt.selected = true;
                    varasSelecionadas.push({ value: option.value, text: option.text });
                }
                optgroup.appendChild(opt);
            });
            dropdown.appendChild(optgroup);
        });

        // Atualiza a lista de varas selecionadas no DOM
        const listaVaras = document.getElementById('listaVaras');
        listaVaras.innerHTML = ''; // Limpa a lista existente

        varasSelecionadas.forEach(vara => {
            const span = document.createElement('span');
            span.textContent = vara.text;
            span.dataset.value = vara.value;
            span.classList.add('badge', 'bg-secondary', 'me-1', 'mb-1');
            span.dataset.bsToggle = 'tooltip';
            span.dataset.bsPlacement = 'bottom';
            span.title = 'Clique para remover';
            listaVaras.appendChild(span);
            new bootstrap.Tooltip(span);
        });

    } catch (error) {
        console.error('Erro ao carregar varas disponíveis:', error);
        document.getElementById('aviso').textContent = 'Erro ao carregar varas disponíveis.';
    }
});



document.getElementById('adicionarVaras').addEventListener('click', () => {
    const dropdown = document.getElementById('dropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const valor = selectedOption.value;
    const texto = selectedOption.textContent;

    // Adiciona a vara selecionada na lista, se não já estiver presente
    if (!varasSelecionadas.some(vara => vara.value === valor)) {
        varasSelecionadas.push({ value: valor, text: texto });

        const listaVaras = document.getElementById('listaVaras');
        const span = document.createElement('span');
        span.textContent = texto;
        span.dataset.value = valor; // Armazena o valor da vara no item da lista
        span.classList.add('badge', 'bg-secondary', 'me-1', 'mb-1');
        span.title = 'Clique para remover'; // Tooltip ao passar o mouse
        listaVaras.appendChild(span);
    } else {
        alert(`A vara ${texto} já está presente na lista.`);
    }
});

document.getElementById('listaVaras').addEventListener('click', event => {
    if (event.target.classList.contains('badge')) {
        // Oculta o tooltip ao clicar no badge
        const tooltip = bootstrap.Tooltip.getInstance(event.target);
        if (tooltip) tooltip.hide();

        const valor = event.target.dataset.value;
        varasSelecionadas = varasSelecionadas.filter(vara => vara.value !== valor);
        event.target.remove();
    }
});

//import { getUltimaConsulta, getProximaConsulta } from './dadosConsulta.mjs';
document.getElementById('iniciarConsulta').addEventListener('click', async () => {
    const botaoIniciarConsulta = document.getElementById('iniciarConsulta');
    botaoIniciarConsulta.disabled = true;

    const dataInicio = document.getElementById('startDate').value;
    const dataFim = document.getElementById('endDate').value;
    const varas = varasSelecionadas.map(v => v.value);

    console.log('Dados enviados para /api/consultar:', { dataInicio, dataFim, varas });

    try {
        const response = await fetch(`/api/consultar?dataInicio=${encodeURIComponent(dataInicio)}&dataFim=${encodeURIComponent(dataFim)}&varas=${encodeURIComponent(varas.join(','))}`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const resultados = await response.json();
        console.log('Resultados recebidos:', resultados);

        const tabela = document.getElementById('resultados');
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';

        if (resultados.length === 0) {
            tabela.style.display = 'none';
            const aviso = document.getElementById('aviso');
            aviso.className = 'alert alert-warning';
            aviso.textContent = 'Nenhum resultado encontrado.';
            return;
        } else {
            tabela.style.display = 'table';
        }

        resultados.forEach(resultado => {
            if (resultado.dados === 'Nenhum resultado encontrado.') {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 6;
                td.textContent = `Vara ${resultado.vara}: Nenhum resultado encontrado.`;
                tr.appendChild(td);
                tbody.appendChild(tr);
            } else {
                resultado.dados.forEach(row => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });

                    const copyButton = document.createElement('button');
                    copyButton.className = 'btn btn-secondary btn-sm';
                    copyButton.innerHTML = '<i class="bi bi-copy"></i>';

                    copyButton.addEventListener('click', () => {
                        const dadosParaCopiar = [row[4], row[1], row[2], row[0], row[3]];
                        const textoParaCopiar = dadosParaCopiar.join(' - ');

                        navigator.clipboard.writeText(textoParaCopiar).then(() => {
                            alert('Dados copiados para a área de transferência!');
                        }).catch(err => {
                            console.error('Erro ao copiar os dados:', err);
                        });
                    });

                    const tdAcoes = document.createElement('td');
                    tdAcoes.appendChild(copyButton);
                    tr.appendChild(tdAcoes);

                    tbody.appendChild(tr);
                });
            }
        });

        const aviso = document.getElementById('aviso');
        aviso.className = 'alert alert-success';
        aviso.textContent = 'Consulta realizada com sucesso!';

    } catch (error) {
        console.error('Erro ao consultar:', error);
        const aviso = document.getElementById('aviso');
        aviso.className = 'alert alert-danger';
        aviso.textContent = 'Erro ao realizar a consulta.';
    } finally {
        botaoIniciarConsulta.disabled = false;
    }
});




// Inicializa os tooltips no DOM
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
