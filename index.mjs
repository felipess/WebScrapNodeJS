import puppeteer from 'puppeteer'; // Doc: https://pptr.dev/
import clipboardy from 'clipboardy';

// Função para obter a data/hora formatada
function getFormattedDatetime() {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR');
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

        const dataInicio = "23/07/2024";
        const dataFim = '23072024';

        // Preencher os campos de data
        await page.focus('#txtVFDataInicio');
        await page.$eval('#txtVFDataInicio', el => el.value = "23/07/2024");
        //await page.keyboard.type('23072024');



        //await page.locator('#txtVFDataInicio').fill('23072024');



        //await page.locator('#txtVFDataTermino').fill(dataFim);

        await page.select('#selVaraFederal', "700200018") //5VF ok


        await page.locator('fsdfsdfsf').fill("sdfsdfs");

        // Query for an element handle.
        const element = await page.waitForSelector('div > .class-name');

        // Do something with element...
        await element.click(); // Just an example.



        /////////////////////////

        // await page.waitForSelector('#txtVFDataInicio');
        // await page.type('#txtVFDataInicio', dataInicio);

        // await page.waitForSelector('#txtVFDataTermino');
        // await page.type('#txtVFDataTermino', dataFim);

        // Defina as varas selecionadas e as ordens de colunas conforme necessário
        // const varasSelecionadas = ['1ª Vara Federal de Guaíra', '5ª Vara Federal de Foz do Iguaçu', '3ª Vara Federal de Foz do Iguaçu'];
        // const ordemColunas = [4, 1, 2, 0, 3];

        // for (const vara of varasSelecionadas) {
        //     console.log(`Consultando: ${vara}`);

        //     // Aguarde o elemento select estar disponível e selecione a opção correta
        //     await page.waitForSelector('#selVaraFederal');
        //     await page.select('#selVaraFederal', vara);

        //     // Clique no botão de consulta e aguarde os resultados
        //     await page.click('#btnConsultar');
        //     await page.waitForTimeout(2000); // Adicione um atraso para garantir que a consulta seja processada

        //     await page.waitForSelector('#tblAudienciasEproc');

        //     const resultadosVara = await page.$$eval('#tblAudienciasEproc tr', linhas => {
        //         return linhas.map(linha => {
        //             const tds = Array.from(linha.querySelectorAll('td'));
        //             return tds.map(td => td.textContent.trim());
        //         }).filter(linha => linha.some(td => td.toLowerCase().includes('custódia')));
        //     });

        //     resultados.push(...resultadosVara);
        // }

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
