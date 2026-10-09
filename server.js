// Підключаємо фреймворк Express
const express = require('express');
const app = express();
const PORT = 3000;

// 1. РОЗДАЧА СТАТИКИ: 
// Сервер буде віддавати файли index.html, css/style.css, js/app.js з поточної папки
app.use(express.static(__dirname));

// 2. БАЗА ДАНИХ СЕРВЕРА (Локальний масив міст згідно з Варіантом 1)
const serverCities = [
    { id: "s1", name: "Париж", lat: 48.85, lon: 2.35 },
    { id: "s2", name: "Лондон", lat: 51.51, lon: -0.13 },
    { id: "s3", name: "Токіо", lat: 35.69, lon: 139.69 }
];

// 3. ЕНДПОІНТ 1: Отримання всього списку міст
app.get('/api/cities', (req, res) => {
    // Встановлюємо правильний заголовок і відправляємо JSON
    res.setHeader('Content-Type', 'application/json');
    res.json(serverCities);
});

// 4. ЕНДПОІНТ 2: Отримання конкретного міста за параметром :id
app.get('/api/cities/:id', (req, res) => {
    // Шукаємо місто в масиві
    const city = serverCities.find(c => c.id === req.params.id);
    
    res.setHeader('Content-Type', 'application/json');
    
    if (!city) {
        // Якщо не знайдено - повертаємо статус 404 (Not Found)
        return res.status(404).json({ error: 'Місто не знайдено на сервері' });
    }
    
    // Якщо знайдено - повертаємо 200 OK (за замовчуванням) та об'єкт міста
    res.json(city);
});

// Запускаємо сервер
app.listen(PORT, () => {
    console.log(`✅ Сервер успішно запущено! Відкрийте http://localhost:${PORT}`);
});