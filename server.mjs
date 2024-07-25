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

// Rota para obter as varas disponíveis
app.get('/api/varas', (req, res) => {
    res.json(varasDisponiveis);
});


// Função para converter data no formato 'YYYY-MM-DD' para 'DD/MM/YYYY'
function formatDateForPuppeteer(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function getFormattedTomorrowDate() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Adiciona um dia
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Função principal de consulta
async function executarConsulta(dataInicio, dataFim, dropdown) {
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

        console.log('Selecionando Dropdown:', dropdown);
        await page.select('#selVaraFederal', dropdown);

        console.log('Clicando no Botão Consultar');
        await page.click('#btnConsultar');

        console.log('Aguardando tabela carregar...');
        // Use waitForSelector em vez de waitForTimeout
        await page.waitForSelector('#tblAudienciasEproc', { timeout: 10000 }); // Aguarda até 10 segundos

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

        return resultadosVara.length > 0 ? resultadosVara : 'Nenhum resultado encontrado.';

    } catch (error) {
        console.error(`Erro: ${error.message}`);
        return `Erro: ${error.message}`;
    } finally {
        await browser.close();
    }
}



// Atualize a rota para usar os parâmetros
app.get('/api/consultar', async (req, res) => {
    const { dataInicio, dataFim, dropdown } = req.query;
    console.log('Parâmetros recebidos:', { dataInicio, dataFim, dropdown });

    const resultados = await executarConsulta(dataInicio, dataFim, dropdown);
    res.json(resultados);
});


// Rota para consultar
app.get('/api/consultar', async (req, res) => {
    const { dataInicio, dataFim, dropdown } = req.query;
    console.log('Parâmetros recebidos:', { dataInicio, dataFim, dropdown });

    const resultados = await executarConsulta(dataInicio, dataFim, dropdown);
    res.json(resultados);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
