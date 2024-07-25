import puppeteer from 'puppeteer'; // Doc: https://pptr.dev/
import clipboardy from 'clipboardy';
import varasDisponiveis from './varasFederais.js';

// Função para obter a hora atual formatada
function getFormattedCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR');
}

function getFormattedCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('pt-BR');
}

function getFormattedTomorrowDate() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Adiciona um dia
    return now.toLocaleDateString('pt-BR');
}

// Função para copiar conteúdo para a área de transferência
function copiarLinha(conteudoLinha, ordemColunas) {
    const conteudoOrdenado = ordemColunas.map(i => conteudoLinha[i]);
    const texto = conteudoOrdenado.join(' | ');
    clipboardy.writeSync(texto);
    console.log(`Conteúdo copiado: ${texto}`);
}

// Função principal de consulta
async function executarConsulta() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage(); // puppeteer - Launch the browser and open a new blank page

    const resultados = [];
    const titulos = ["Data/Hora", "Processo", "Juízo/Competência", "Sala", "Evento/Observação"]; // Títulos desejados

    // Lista de termos para ignorar texto após eles
    const termosIgnorados = ["Classe:", "Autor:", "Réu:", "Observação:"];

    try {
        await page.goto('https://eproc.jfpr.jus.br/eprocV2/externo_controlador.php?acao=pauta_audiencias');

        // Set screen size.
        await page.setViewport({ width: 1080, height: 1024 });

        const dataInicio = getFormattedCurrentDate();
        const dataFim = getFormattedTomorrowDate();

        // Preencher os campos de data
        await page.$eval('#txtVFDataInicio', (el, value) => el.value = value, dataInicio);
        await page.$eval('#txtVFDataTermino', (el, value) => el.value = value, dataFim);

        for (const varaGroup of varasDisponiveis) {
            for (const vara of varaGroup.options) {
                console.log(`Consultando: ${vara.text}`);

                await page.waitForSelector('#selVaraFederal');
                await page.select('#selVaraFederal', vara.value); // Seleciona a opção da vara

                // Clique no botão de consulta e aguarde os resultados
                await page.click('#btnConsultar');

                // Espera o seletor dos resultados estar visível
                await page.waitForSelector('#tblAudienciasEproc');

                // Filtra e processa as linhas da tabela
                const resultadosVara = await page.$$eval('#tblAudienciasEproc tr', (linhas, titulos, termosIgnorados) => {
                    return linhas.map(linha => {
                        const textoNormalizado = linha.textContent.toLowerCase();
                        if (['custódia', 'custodia'].some(termo => textoNormalizado.includes(termo))) {
                            const tds = Array.from(linha.querySelectorAll('td'));
                            const conteudoLinha = [];
                            let erroEncontrado = false;

                            tds.forEach(td => {
                                const tdHtml = td.innerHTML;

                                // Remove conteúdo entre <br> tags e outras tags HTML
                                let tdText = tdHtml
                                    .replace(/<br\s*\/?>/gi, ' ')
                                    .replace(/<\/?[^>]+>/gi, ' ')
                                    .replace("Sala: ", " ")
                                    .replace("Evento: ", " ")
                                    .trim(); // Remove tags HTML e espaços em branco

                                // Remove texto após qualquer um dos termos ignorados
                                termosIgnorados.forEach(termo => {
                                    const pos = tdText.toLowerCase().indexOf(termo.toLowerCase());
                                    if (pos !== -1) {
                                        tdText = tdText.slice(0, pos).trim();
                                    }
                                });

                                if (tdText.toLowerCase().includes('ocorreu um erro')) {
                                    erroEncontrado = true;
                                }
                                conteudoLinha.push(tdText);
                            });

                            // Verifica se não ocorreu erro e filtra com base nos títulos esperados
                            if (!erroEncontrado) {
                                // Filtra os dados com base no número de títulos desejados
                                const conteudoFiltrado = titulos.map(titulo => conteudoLinha.shift() || '');
                                return conteudoFiltrado;
                            }
                        }
                        return null;
                    }).filter(linha => linha !== null);
                }, titulos, termosIgnorados);

                // Adiciona os resultados ao array final
                resultados.push(...resultadosVara);
            }
        }

        if (resultados.length === 0) {
            console.log('Nenhum resultado encontrado.');
        } else {
            console.log('Resultados encontrados:');
            console.table(resultados);
        }

    } catch (error) {
        console.error(`Erro: ${error.message}`);
    } finally {
        await browser.close();
    }
}

// Agendar a próxima consulta
function agendarProximaConsulta() {
    setTimeout(() => {
        executarConsulta().then(() => agendarProximaConsulta());
    }, 900000); // 15 minutos em milissegundos
}

// Executar a primeira consulta
executarConsulta().then(() => agendarProximaConsulta());
