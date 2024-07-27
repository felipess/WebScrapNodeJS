import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import varasDisponiveis from './varasFederais.js';
import { executarConsulta } from './consulta.mjs';
import { getUltimaConsulta, getProximaConsulta, setUltimaConsulta, setProximaConsulta, getStatusExecucao, setStatusExecucao } from './dadosConsulta.mjs';
import { Server as SocketIOServer } from 'socket.io';

// Obtém o caminho do diretório do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
const io = new SocketIOServer(server, { // 43.200 requisições mes se 24h //11.880 - 9h dia * 22dias
    pingInterval: 60000,  // Intervalo de ping - 1 min
    pingTimeout: 5000     // Tempo limite para resposta de pong - 5s
});

// Exporta o io para que outros módulos possam usá-lo
export { io };

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
        res.status(500).json({
            error: error.message,
            status: 'error',
            message: 'Erro ao realizar a consulta.'
        });
    }
});

// Endpoint para obter as datas da consulta
app.get('/api/datas-consulta', (req, res) => {
    res.json({
        status: getStatusExecucao(),
        ultimaConsulta: getUltimaConsulta(),
        proximaConsulta: getProximaConsulta()
    });
});

// Endpoint para atualizar informações de consulta
app.post('/api/atualizar-consulta', (req, res) => {
    const { ultimaConsulta, proximaConsulta, status } = req.body;

    setStatusExecucao(status);
    setUltimaConsulta(ultimaConsulta);
    setProximaConsulta(proximaConsulta);

    io.emit('atualizar-status', {
        status,
        ultimaConsulta,
        proximaConsulta
    });

    res.status(200).json({ message: 'Informações atualizadas com sucesso!' });
});

// Endpoint para definir a última consulta
app.post('/api/ultima-consulta', (req, res) => {
    const { data } = req.body;
    setUltimaConsulta(data);
    io.emit('atualizar-status', {
        status: getStatusExecucao(),
        ultimaConsulta: getUltimaConsulta(),
        proximaConsulta: getProximaConsulta()
    });
    res.status(200).json({ message: 'Última consulta atualizada.' });
});

// Endpoint para definir a próxima consulta
app.post('/api/proxima-consulta', (req, res) => {
    const { data } = req.body;
    setProximaConsulta(data);
    io.emit('atualizar-status', {
        status: getStatusExecucao(),
        ultimaConsulta: getUltimaConsulta(),
        proximaConsulta: getProximaConsulta()
    });
    res.status(200).json({ message: 'Próxima consulta atualizada.' });
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
