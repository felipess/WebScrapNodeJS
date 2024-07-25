import express from 'express';
import puppeteer from 'puppeteer';
import clipboardy from 'clipboardy';
import varasDisponiveis from './varasFederais.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtém o caminho do diretório do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware para lidar com JSON
app.use(express.json());

// Middleware para servir arquivos estáticos do diretório 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a raiz, serve o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Função para obter a hora e data formatadas
function getFormattedCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('pt-BR');
}

function getFormattedTomorrowDate() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Adiciona um dia
    return now.toLocaleDateString('pt-BR');
}

// Função principal de consulta
async function executarConsulta() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const resultados = [];
    const titulos = ["Data/Hora", "Processo", "Juízo/Competência", "Sala", "Evento/Observação"];
    const termosIgnorados = ["Classe:", "Autor:", "Réu:", "Observação:"];

    try {
        await page.goto('https://eproc.jfpr.jus.br/eprocV2/externo_controlador.php?acao=pauta_audiencias');

        await page.setViewport({ width: 1080, height: 1024 });

        const dataInicio = getFormattedCurrentDate();
        const dataFim = getFormattedTomorrowDate();

        await page.$eval('#txtVFDataInicio', (el, value) => el.value = value, dataInicio);
        await page.$eval('#txtVFDataTermino', (el, value) => el.value = value, dataFim);

        for (const varaGroup of varasDisponiveis) {
            for (const vara of varaGroup.options) {
                console.log(`Consultando: ${vara.text}`);

                await page.waitForSelector('#selVaraFederal');
                await page.select('#selVaraFederal', vara.value);

                await page.click('#btnConsultar');
                await page.waitForSelector('#tblAudienciasEproc');

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

                resultados.push(...resultadosVara);
            }
        }

        return resultados.length > 0 ? resultados : 'Nenhum resultado encontrado.';

    } catch (error) {
        console.error(`Erro: ${error.message}`);
        return `Erro: ${error.message}`;
    } finally {
        await browser.close();
    }
}

// Rota para consultar
app.get('/api/consultar', async (req, res) => {
    const { dataInicio, dataFim, dropdown } = req.query;
    console.log('Parâmetros recebidos:', { dataInicio, dataFim, dropdown });

    const resultados = await executarConsulta();
    res.json(resultados);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
