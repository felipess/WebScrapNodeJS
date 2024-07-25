import puppeteer from 'puppeteer';

// Função para converter data no formato 'YYYY-MM-DD' para 'DD/MM/YYYY'
function formatDateForPuppeteer(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Função principal de consulta
// Função principal de consulta
export async function executarConsulta(dataInicio, dataFim, varas) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const resultados = [];
    const titulos = ["Data/Hora", "Processo", "Juízo/Competência", "Sala", "Evento/Observação"];
    const termosIgnorados = ["Classe:", "Autor:", "Réu:", "Observação:"];

    try {
        await page.goto('https://eproc.jfpr.jus.br/eprocV2/externo_controlador.php?acao=pauta_audiencias');
        await page.setViewport({ width: 1080, height: 1024 });

        const dataInicioFormatada = formatDateForPuppeteer(dataInicio);
        const dataFimFormatada = formatDateForPuppeteer(dataFim);

        console.log('Definindo Data Início:', dataInicioFormatada);
        await page.$eval('#txtVFDataInicio', (el, value) => el.value = value, dataInicioFormatada);
        console.log('Definindo Data Fim:', dataFimFormatada);
        await page.$eval('#txtVFDataTermino', (el, value) => el.value = value, dataFimFormatada);

        for (const dropdown of varas) {
            console.log('Selecionando Dropdown:', dropdown);
            await page.select('#selVaraFederal', dropdown);

            console.log('Clicando no Botão Consultar');
            await page.click('#btnConsultar');

            // Aguarda até que o conteúdo da página esteja disponível
            console.log('Aguardando tabela carregar...');
            await page.waitForFunction(
                () => document.querySelector('#tblAudienciasEproc') !== null,
                { timeout: 5000 } // Aumenta o tempo limite para 60 segundos
            );

            // Verifica o conteúdo da página para depuração
            const pageContent = await page.content();
            console.log('Conteúdo da página após clique:', pageContent);

            try {
                console.log('Aguardando tabela carregar...');
                await page.waitForSelector('#tblAudienciasEproc', { timeout: 60000 }); // Aumenta o tempo limite para 60 segundos
            } catch (waitError) {
                console.error('Erro ao esperar pelo seletor:', waitError);
                throw waitError; // Re-throw the error after logging
            }

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
                    vara: dropdown,
                    dados: resultadosVara
                });
            } else {
                resultados.push({
                    vara: dropdown,
                    dados: 'Nenhum resultado encontrado.'
                });
            }
        }

        return resultados;

    } catch (error) {
        console.error(`Erro: ${error.message}`);
        throw new Error(error.message);
    } finally {
        await browser.close();
    }
}

