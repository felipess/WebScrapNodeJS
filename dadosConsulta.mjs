let ultimaConsulta = ''; // Valor padrão inicial
let proximaConsulta = '-'; // Valor padrão inicial

export function getUltimaConsulta() {
    console.log('Obtendo última consulta:', ultimaConsulta);
    return ultimaConsulta;
}

export function setUltimaConsulta(data) {
    console.log('Definindo última consulta para:', data);
    ultimaConsulta = data;
    // atualizarLabels(); // Atualiza os labels
}

export function getProximaConsulta() {
    console.log('Obtendo próxima consulta:', proximaConsulta);
    return proximaConsulta;
}

export function setProximaConsulta(data) {
    console.log('Definindo próxima consulta para:', data);
    proximaConsulta = data;
    // atualizarLabels(); // Atualiza os labels
}

// // Função para atualizar os labels no DOM
// function atualizarLabels() {
//     document.getElementById('ultimaConsulta').textContent = `Última consulta: ${getUltimaConsulta()}`;
//     document.getElementById('proximaConsulta').textContent = `Próxima consulta: ${getProximaConsulta()}`;
// }
