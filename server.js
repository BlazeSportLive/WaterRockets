const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.txt');

// Middleware для чтения JSON
app.use(express.json());

// Раздаем статику (ваш index.html) из текущей папки
app.use(express.static(__dirname));

// 1. Получить все данные (Чтение из txt-файла)
app.get('/api/data', (req, res) => {
    if (!fs.existsSync(DB_FILE)) {
        // Если файла нет, создаем дефолтную структуру
        const initialData = JSON.stringify({ children: [] }, null, 2);
        fs.writeFileSync(DB_FILE, initialData, 'utf-8');
    }

    try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        res.json(jsonData);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка чтения базы данных (txt)' });
    }
});

// 2. Сохранить все данные (Запись в txt-файл)
app.post('/api/data', (req, res) => {
    try {
        const newData = req.json ? req.body : req.body;
        // Красиво форматируем JSON в текстовом файле для удобного чтения
        fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка записи в базу данных (txt)' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен! Откройте в браузере: http://localhost:${PORT}`);
});