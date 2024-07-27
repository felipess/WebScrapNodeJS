import puppeteer from 'puppeteer';
import { setUltimaConsulta, setProximaConsulta, setStatusExecucao } from './dadosConsulta.mjs';

// Função para converter data no formato 'YYYY-MM-DD' para 'DD/MM/YYYY'
function formatDateForPuppeteer(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function finalizaConsulta() {
    // Atualiza a última consulta
    const ultimaConsulta = new Date().toLocaleString();
    console.log(`Última consulta: ${ultimaConsulta}`);
    setUltimaConsulta(ultimaConsulta); // Atualiza a última consulta no módulo de dados
    setStatusExecucao(''); // Define o status como "Finalizada"
}

const interval = 1 * 60 * 1000; // Intervalo de 1 minuto em milissegundos

// Função principal de consulta
export async function executarConsulta(dataInicio, dataFim, varas) {
    setStatusExecucao('Em Execução'); // Define o status como "Em Execução"
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const resultados = [];
    const titulos = ["Data/Hora", "Processo", "Juízo/Competência", "Sala", "Evento/Observação"];
    const termosIgnorados = ["Classe:", "Autor:", "Réu:", "Observação:"];

    try {
        await page.goto('https://eproc.jfpr.jus.br/eprocV2/externo_controlador.php?acao=pauta_audiencias');
        await page.setViewport({ width: 1920, height: 1080 });

        const dataInicioFormatada = formatDateForPuppeteer(dataInicio);
        console.log('Definindo Data Início:', dataInicioFormatada);

        const dataFimFormatada = formatDateForPuppeteer(dataFim);
        await page.waitForSelector('#divInfraAreaDados', { timeout: 500 });

        for (const varaFederal of varas) {
            try {
                await page.waitForSelector('#txtVFDataInicio', { timeout: 500 });
                await page.$eval('#txtVFDataInicio', (el, value) => el.value = value, dataInicioFormatada);
                await sleep(500); // Espera 

                console.log('Definindo Data Fim:', dataFimFormatada);
                await page.waitForSelector('#txtVFDataTermino', { timeout: 500 });
                await page.$eval('#txtVFDataTermino', (el, value) => el.value = value, dataFimFormatada);

                await sleep(500); // Espera 

                await page.waitForSelector('#divRowVaraFederal', { timeout: 500 });

                await page.waitForSelector('#selVaraFederal', { timeout: 1000 });
                console.log('Selecionando varaFederal:', varaFederal);

                await page.$eval('#selVaraFederal', (el, value) => el.value = value, varaFederal);
                const varaFederalText = await page.$eval('#selVaraFederal', el => el.options[el.selectedIndex].text);

                setStatusExecucao("Consultando: " + varaFederalText + "...");


                await sleep(500); // Espera 

                console.log('Clicando no Botão Consultar');
                await page.click('#btnConsultar');

                await sleep(500); // Espera 

                // Verifica se há a mensagem de nenhum resultado encontrado
                const mensagemNenhumResultado = await page.$eval('#divInfraAreaTabela', (div) => {
                    return div.textContent.includes('Nenhum resultado encontrado');
                }).catch(() => false);

                if (mensagemNenhumResultado) {
                    console.log(`Nenhum resultado encontrado para a vara ${varaFederal}.`);
                    continue; // Continua para o próximo varaFederal
                }

                await sleep(1000); // Espera 

                const resultadosVara = await page.$$eval('#tblAudienciasEproc tr', (linhas, titulos, termosIgnorados) => {
                    return linhas.map(linha => {
                        const textoNormalizado = linha.textContent.toLowerCase();
                        if (['custódia', 'custodia'].some(termo => textoNormalizado.includes(termo))) {
                            const tds = Array.from(linha.querySelectorAll('td'));
                            const conteudoLinha = [];
                            let erroEncontrado = false;

                            tds.forEach(td => {
                                let tdText = td.innerHTML
                                    .replace(/<br\s*\/?>/gi, ' ')
                                    .replace(/<\/?[^>]+>/gi, ' ')
                                    .replace("Sala: ", " ")
                                    .replace("Evento: ", " ")
                                    .trim();

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

                            if (!erroEncontrado) {
                                const conteudoFiltrado = titulos.map(titulo => conteudoLinha.shift() || '');
                                return conteudoFiltrado;
                            }
                        }
                        return null;
                    }).filter(linha => linha !== null);
                }, titulos, termosIgnorados);

                if (resultadosVara.length > 0) {
                    resultados.push({
                        vara: varaFederal,
                        dados: resultadosVara
                    });
                }

            } catch (error) {
                console.error(`Erro ao processar varaFederal ${varaFederal}:`, error);
                continue;
            }
        }

        return resultados;

    } catch (error) {
        finalizaConsulta();
        console.error(`Erro: ${error.message}`);
        throw new Error(error.message);
    } finally {
        await browser.close();

        // Calcula e exibe a próxima consulta
        const proximaConsulta = new Date(Date.now() + interval).toLocaleString();
        console.log(`Próxima consulta: ${proximaConsulta}`);
        setProximaConsulta(proximaConsulta); // Atualiza a próxima consulta no módulo de dados
        finalizaConsulta();
        setTimeout(() => executarConsulta(dataInicio, dataFim, varas), interval);
    }
}
