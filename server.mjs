import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import varasDisponiveis from './varasFederais.js';
import { executarConsulta } from './consulta.mjs'; // Importa a função de consulta
import { getUltimaConsulta, getProximaConsulta, setUltimaConsulta, setProximaConsulta } from './dadosConsulta.mjs';

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

// Rota para consultar
app.get('/api/consultar', async (req, res) => {
    const { dataInicio, dataFim, varas } = req.query;

    console.log('Parâmetros recebidos:', { dataInicio, dataFim, varas });

    const varasArray = varas ? varas.split(',') : []; // Converte a string em um array

    try {
        const resultados = await executarConsulta(dataInicio, dataFim, varasArray);
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obter as datas da consulta
app.get('/api/datas-consulta', (req, res) => {
    res.json({
        ultimaConsulta: getUltimaConsulta(),
        proximaConsulta: getProximaConsulta()
    });
});

// Endpoint para definir a última consulta
app.post('/api/ultima-consulta', (req, res) => {
    const { data } = req.body;
    setUltimaConsulta(data);
    res.status(200).json({ message: 'Última consulta atualizada.' });
});

// Endpoint para definir a próxima consulta
app.post('/api/proxima-consulta', (req, res) => {
    const { data } = req.body;
    setProximaConsulta(data);
    res.status(200).json({ message: 'Próxima consulta atualizada.' });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
