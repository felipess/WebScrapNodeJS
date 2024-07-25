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

    try {
        await page.goto('https://eproc.jfpr.jus.br/eprocV2/externo_controlador.php?acao=pauta_audiencias');

        // Set screen size.
        await page.setViewport({ width: 1080, height: 1024 });

        //await page.waitForSelector('#divRowVaraFederal');

        const dataInicio = getFormattedCurrentDate();
        const dataFim = getFormattedTomorrowDate();

        // Preencher os campos de data
        //await page.focus('#txtVFDataInicio');
        await page.$eval('#txtVFDataInicio', (el, value) => el.value = value, dataInicio);
        await page.$eval('#txtVFDataTermino', (el, value) => el.value = value, dataFim);

        //await page.keyboard.type('23072024');

        //await page.locator('#txtVFDataInicio').fill('23072024');

        //await page.locator('#txtVFDataTermino').fill(dataFim);

        //await page.select('#selVaraFederal', "700200018") //5VF ok

        // Query for an element handle.
        //const element = await page.waitForSelector('div > .class-name');

        // Do something with element...
        //await element.click(); // Just an example.

        // await page.waitForSelector('#txtVFDataInicio');
        // await page.type('#txtVFDataInicio', dataInicio);

        // await page.waitForSelector('#txtVFDataTermino');
        // await page.type('#txtVFDataTermino', dataFim);

        // Defina as varas selecionadas e as ordens de colunas conforme necessário


        // const ordemColunas = [4, 1, 2, 0, 3];

        for (const varaGroup of varasDisponiveis) {
            for (const vara of varaGroup.options) {
                // Supondo que cada objeto tenha uma propriedade `value` que você quer selecionar
                console.log(`Consultando: ${vara.value}`);

                await page.waitForSelector('#selVaraFederal');
                await page.select('#selVaraFederal', vara.value); // Seleciona a opção da vara

                // Clique no botão de consulta e aguarde os resultados
                await page.click('#btnConsultar');

                // Espera o seletor dos resultados estar visível
                await page.waitForSelector('#tblAudienciasEproc');

                // Coleta os resultados
                const resultadosVara = await page.$$eval('#tblAudienciasEproc tr', linhas => {
                    return linhas.map(linha => {
                        const tds = Array.from(linha.querySelectorAll('td'));
                        return tds.map(td => td.textContent.trim());
                    }).filter(linha =>
                        linha.some(td =>
                            td.toLowerCase().includes('custódia') ||
                            td.toLowerCase().includes('custodia')
                        )
                    );
                });

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
    }, 900000); // 15 minutes in milliseconds
}

// Executar a primeira consulta
executarConsulta().then(() => agendarProximaConsulta());
