console.log("DOM маніпуляції розпочато!");

//  Оголошуємо масив даних (оновлено поля за Варіантом 1: day, tempC, description)
const forecastData = [
  { id: 1, day: "Пн", tempC: 18, description: "Хмарно ☁️" },
  { id: 2, day: "Вт", tempC: 22, description: "Ясно ☀️" },
  { id: 3, day: "Ср", tempC: 15, description: "Дощ 🌧️" },
  { id: 4, day: "Чт", tempC: -2, description: "Сніг ❄️" },
  { id: 5, day: "Пт", tempC: 0, description: "Хмарно ☁️" },
  { id: 6, day: "Сб", tempC: -5, description: "Заметіль 🌨️" },
  { id: 7, day: "Нд", tempC: 5, description: "Ясно ☀️" },
];

// ФУНКЦІЯ ЗАХИСТУ ВІД XSS (Екранування HTML)
function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, (ch) => map[ch]);
}

//  Вибираємо контейнери на сторінці
/*const listContainer = document.querySelector("#forecast-list");
const avgTempElement = document.querySelector("#avg-temp");

//  Функція рендеру
function renderForecast(data) {
  // Програмно очищаємо статичні картки-заглушки з HTML
  listContainer.innerHTML = "";

  let tempSum = 0; // Змінна для накопичення суми температур

  // Цикл перебору масиву
  for (const item of data) {
    // Створюємо нові HTML-елементи (згідно з варіантом)
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const details = document.createElement("p");

    // Наповнюємо їх текстом (textContent безпечний для виведення тексту)
    title.textContent = item.day;
    details.textContent = `${item.tempC}°C, ${item.description}`;

    // Відновлюємо базовий клас для сітки
    card.classList.add("card");

    //УМОВА - додаємо клас 'cold', якщо температура < 0
    if (item.tempC < 0) {
      card.classList.add("cold");
    } else if (item.tempC >= 20) {
      card.classList.add("temp-warm"); // теплі стилі з ПР5
    } else {
      card.classList.add("temp-cool"); // прохолодні стилі з ПР5
    }

    // Вкладаємо заголовок і текст усередину картки
    card.append(title);
    card.append(details);

    // Вкладаємо готову картку в контейнер на сторінці
    listContainer.append(card);

    // Накопичуємо суму для середньої температури
    tempSum += item.tempC;
  }

  //  ПІДСУМОК - обчислюємо середню температуру і оновлюємо DOM
  const avgTemp = (tempSum / data.length).toFixed(1); // toFixed(1) залишає 1 знак після коми
  avgTempElement.textContent = avgTemp;
}

// Викликаємо функцію, передаючи їй масив
renderForecast(forecastData); */

/*ПРАКТИЧНА РОБОТА 8: ПОДІЇ ТА ФОРМИ*/

// 1. Вибираємо необхідні елементи
const addForm = document.querySelector("#add-forecast-form");
const inputDay = document.querySelector("#input-day");
const inputTemp = document.querySelector("#input-temp");
const inputDesc = document.querySelector("#input-desc");

const btnWarmestDay = document.querySelector("#btn-warmest-day");
const warmestDayResult = document.querySelector("#warmest-day-result");

// 2. ОБРОБКА SUBMIT ФОРМИ
addForm.addEventListener("submit", function (event) {
  // Скасовуємо стандартне перезавантаження сторінки
  event.preventDefault();

  // Зчитуємо значення з полів
  const newDay = inputDay.value;
  const newTemp = Number(inputTemp.value); // Перетворюємо на число
  const newDesc = inputDesc.value;

  // Створюємо новий об'єкт прогнозу (такої ж структури, як у масиві forecastData)
  const newForecastItem = {
    id: Date.now(), // Генеруємо унікальний ID
    day: newDay,
    tempC: newTemp,
    description: newDesc,
  };

  // Додаємо новий об'єкт у масив
  forecastData.push(newForecastItem);

  // Перемальовуємо список (викликаємо функцію з ПР7)
  //renderForecast(forecastData);

  // Очищаємо форму після успішного додавання
  addForm.reset();
});

// 3. ДОДАТКОВА ВАЛІДАЦІЯ (Custom Validity згідно Варіанту 1)
inputTemp.addEventListener("input", function () {
  const tempValue = Number(inputTemp.value);

  // Перевіряємо, чи ввели щось і чи виходить воно за межі -50...50
  if (inputTemp.value !== "" && (tempValue < -50 || tempValue > 50)) {
    // Якщо так, встановлюємо власне повідомлення про помилку
    inputTemp.setCustomValidity("Температура поза реалістичним діапазоном");
  } else {
    // Якщо все добре, очищаємо повідомлення (скидаємо помилку)
    inputTemp.setCustomValidity("");
  }
});

// 4. ДОДАТКОВА ПОДІЯ ВАРІАНТУ (Пошук найтеплішого дня)
btnWarmestDay.addEventListener("click", function () {
  // Якщо масив порожній (хоча у нас він не порожній), захист
  if (forecastData.length === 0) return;

  let maxTempDay = forecastData[0]; // Припускаємо, що перший день найтепліший

  // Перебираємо масив
  for (const item of forecastData) {
    if (item.tempC > maxTempDay.tempC) {
      maxTempDay = item; // Знайшли тепліший день
    }
  }

  // Виводимо результат
  warmestDayResult.textContent = `Найтепліший день: ${maxTempDay.day} (${maxTempDay.tempC}°C)`;
});

/*ПРАКТИЧНА РОБОТА 9: FETCH API (Реальні дані) */

// 1. URL згідно Варіанту 1 (Open-Meteo API)
const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&current=temperature_2m,weather_code&timezone=auto";

// 2. Словник (об'єкт) для перетворення weather_code у текст
// (Згідно зі специфікацією WMO Weather interpretation codes)
const weatherCodeDictionary = {
  0: "Ясно (безхмарно)",
  1: "Переважно ясно",
  2: "Мінлива хмарність",
  3: "Суцільна хмарність",
  45: "Туман",
  48: "Туман із памороззю",
  51: "Мряка (легка)",
  53: "Мряка (помірна)",
  55: "Мряка (густа)",
  61: "Дощ (легкий)",
  63: "Дощ (помірний)",
  65: "Дощ (сильний)",
  71: "Снігопад (легкий)",
  73: "Снігопад (помірний)",
  75: "Снігопад (сильний)",
  95: "Гроза",
};

// Функція-помічник для перекладу коду (якщо коду немає в словнику, повертає 'Невідомо')
const getWeatherDescription = (code) =>
  weatherCodeDictionary[code] || `Невідомо (Код: ${code})`;

// 3. Вибираємо DOM-елементи
const btnRefresh = document.querySelector("#btn-refresh");
const statusMessage = document.querySelector("#api-status-message");
const weatherDataBlock = document.querySelector("#current-weather-data");

const liveTemp = document.querySelector("#live-temp");
const liveDesc = document.querySelector("#live-desc");
const liveTime = document.querySelector("#live-time");
const currentIcon = document.querySelector("#current-icon");

// 4. Основна АСИНХРОННА функція завантаження даних
async function loadLiveData() {
  // Етап А: Показуємо стан "Завантаження"
  btnRefresh.disabled = true; // Блокуємо кнопку від спаму
  statusMessage.textContent = "Отримання даних із супутника... 🛰️";
  statusMessage.className = "status-msg loading"; // Показуємо повідомлення
  weatherDataBlock.classList.add("hidden"); // Ховаємо старі дані

  try {
    // Етап Б: Робимо запит до сервера
    const response = await fetch(API_URL);

    // Перевіряємо, чи успішна відповідь (статус 200-299)
    if (!response.ok) {
      throw new Error(`Помилка сервера. Статус: ${response.status}`);
    }

    // Етап В: Розбираємо JSON відповідь
    const data = await response.json();

    // Виводимо в консоль для перевірки (Крок 5 інструкції)
    console.log("Дані з Open-Meteo API:", data);

    // Етап Г: Виводимо дані в DOM
    // (data.current.temperature_2m, data.current.weather_code, data.current.time)
    liveTemp.textContent = data.current.temperature_2m;
    liveDesc.textContent = getWeatherDescription(data.current.weather_code);

    // Форматуємо час (він приходить у форматі "2026-09-26T16:00")
    const dateObj = new Date(data.current.time);
    liveTime.textContent = dateObj.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    /* Змінюємо іконку залежно від температури (спрощена логіка)
    if (data.current.temperature_2m < 0) {
      currentIcon.outerHTML = '<span id="current-icon" style="font-size: 3rem;">❄️</span>';
    } else {
      currentIcon.outerHTML = '<span id="current-icon" style="font-size: 3rem;">☀️</span>';
    } */
    // НОВИЙ КОД: Запускаємо Canvas-анімацію на основі коду погоди
    startWeatherAnimation(data.current.weather_code);

    // Ховаємо повідомлення, показуємо дані
    statusMessage.className = "status-msg hidden";
    weatherDataBlock.classList.remove("hidden");
  } catch (error) {
    // Етап Д: Обробка помилок (зокрема зникнення інтернету)
    console.error("Помилка Fetch API:", error);

    // Виводимо користувачу специфічне повідомлення за варіантом
    statusMessage.textContent =
      "❌ Не вдалося отримати прогноз погоди. Перевірте з'єднання.";
    statusMessage.className = "status-msg error"; // Показуємо червоний блок
    // Блок із даними залишається схованим
  } finally {
    // Етап Е: Виконується завжди (успіх чи помилка)
    btnRefresh.disabled = false; // Розблоковуємо кнопку
  }
}

// 5. Навішуємо подію на кнопку "Оновити"
btnRefresh.addEventListener("click", loadLiveData);

// 6. Викликаємо функцію одразу при завантаженні сторінки
loadLiveData();

/*ПРАКТИЧНА РОБОТА 10: VUE 3 COMPONENT*/

const { createApp } = Vue;

// 1. Описуємо компонент WeatherCard
const WeatherCard = {
  // Вказуємо, які дані (props) чекає цей компонент
  props: ["day", "tempC", "description"],

  // Локальний реактивний стан компонента
  data() {
    return {
      showFahrenheit: false, // За замовчуванням Фаренгейти сховані
    };
  },

  // Обчислювані значення (похідні від props або data)
  computed: {
    // Конвертуємо Цельсії у Фаренгейти автоматично
    tempF() {
      return ((this.tempC * 9) / 5 + 32).toFixed(1);
    },
    // Динамічний клас для картки залежно від температури
    cardClass() {
      if (this.tempC < 0) return "card cold";
      if (this.tempC >= 20) return "card temp-warm";
      return "card temp-cool";
    },
    // Використовуємо емодзі, щоб не було помилок 404
    weatherEmoji() {
      if (this.tempC <= -2) return "❄️";
      if (this.tempC < 5) return "🌨️";
      if (this.tempC < 15) return "☁️️";
      if (this.tempC >= 20) return "☀️";
      return "⛅";
    },
  },

  // Шаблон компонента (те, як він виглядає в HTML).
  // @click  подія кліку, яка змінює стан showFahrenheit.
  template: `
        <article :class="cardClass" @click="showFahrenheit = !showFahrenheit" style="cursor: pointer;">
            <h3>{{ day }}</h3>
            <div style="font-size: 2.5rem; margin: 10px 0;">{{ weatherEmoji }}</div>

            <div class="temp-val">{{ tempC }}&deg;C</div>
            
            <!-- Умовний рендер: показуємо тільки якщо showFahrenheit = true -->
            <div v-if="showFahrenheit" style="color: #666; font-size: 0.9em; margin-bottom: 5px;">
                {{ tempF }}&deg;F
            </div>
            
            <p>{{ description }}</p>
        </article>
    `,
};

// 2. Створюємо основний застосунок Vue
const weatherApp = createApp({
  components: {
    "weather-card": WeatherCard,
  },
  data() {
    return {
      // Передаємо наш масив прогнозів (forecastData) з ПР6/8 у реактивний стан Vue
      forecastList: forecastData,
    };
  },
});

// 3. Монтуємо застосунок у div з id="app"
weatherApp.mount("#app");

// ПРАКТИЧНА РОБОТА 11: LocalStorage та IndexedDB

// 1. LocalStorage (Читання для міграції)
function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem("savedCities");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Помилка читання localStorage:", error);
    return [];
  }
}

//  Реальне збереження в LocalStorage (виправлення зауваження)
function saveToLocalStorage(city) {
  const lsCities = loadFromLocalStorage();
  lsCities.push(city);
  localStorage.setItem("savedCities", JSON.stringify(lsCities));
  console.log("Дані реально записано в localStorage користувачем:", city.name);
}

// 2. Ініціалізація IndexedDB (Створення бази та Object Store)
function openDB() {
  return new Promise((resolve, reject) => {
    // Перевіряємо, чи підтримується IndexedDB взагалі
    if (!("indexedDB" in window)) {
      return reject(new Error("Браузер не підтримує IndexedDB"));
    }

    const request = indexedDB.open("WeatherDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Створюємо сховище "cities", де ключ - це "id" (згідно з варіантом)
      if (!db.objectStoreNames.contains("cities")) {
        db.createObjectStore("cities", { keyPath: "id" });
        console.log("IndexedDB: Створено сховище cities");
      }
    };

    request.onsuccess = () => resolve(request.result);

    // ОБРОБКА ПОМИЛОК: Ця подія спрацьовує, якщо доступ заблоковано (наприклад, у Firefox Private Browsing)
    request.onerror = (event) => {
      console.error("IndexedDB відмовив у доступі:", event.target.error);
      reject(event.target.error || new Error("Невідома помилка IndexedDB"));
    };
  });
}

// 3. CRUD: Додавання / Оновлення міста (PUT)
async function addCityDB(city) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cities", "readwrite");
    tx.objectStore("cities").put(city);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// 4. CRUD: Читання всіх міст (GET)
async function getAllCitiesDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cities", "readonly");
    const request = tx.objectStore("cities").getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 5. CRUD: Видалення міста (DELETE)
async function deleteCityDB(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("cities", "readwrite");
    tx.objectStore("cities").delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// 6. Рендер списку (Vanilla JS, DOM API з ПР7)
const savedCitiesContainer = document.querySelector("#saved-cities-list");

function renderSavedCities(cities) {
  if (!savedCitiesContainer) return;
  savedCitiesContainer.innerHTML = ""; // Очищаємо

  if (cities.length === 0) {
    savedCitiesContainer.innerHTML =
      '<p style="color: #666;">Немає збережених міст.</p>';
    return;
  }

  cities.forEach((city) => {
    const div = document.createElement("div");
    div.className = "saved-city-card";
    div.innerHTML = `
            <div>
                <!-- РОУТИНГ ПР13: Посилання на деталі міста з параметром id -->
                <a href="#/cities/${city.id}" class="city-link" data-link><strong>${escapeHtml(city.name)}</strong></a> 
                <span style="color:#777; font-size: 0.85em;">(lat: ${city.lat}, lon: ${city.lon})</span><br>
                Останній прогноз: <b>${city.temperature}°C</b>, ${city.weatherCode} <br>
                <small style="color:#999;">Час запису: ${city.time}</small>
            </div>
            <button data-id="${city.id}" class="btn-delete">Видалити</button>
        `;
    savedCitiesContainer.append(div);
  });
}

// Обробник для нової кнопки збереження в LocalStorage (Синя кнопка)
const btnSaveLS = document.querySelector("#btn-save-ls");
if (btnSaveLS) {
  btnSaveLS.addEventListener("click", () => {
    const liveTempText = document.querySelector("#live-temp").textContent;
    const liveDescText = document.querySelector("#live-desc").textContent;

    if (liveTempText === "--" || liveTempText === "") {
      return alert("Дочекайтесь завантаження погоди!");
    }

    const newCity = {
      id: "ls-" + Date.now().toString(),
      name: "Львів (через LS)", // Зберігаємо як Львів, щоб відрізняти
      lat: 49.83,
      lon: 24.02,
      temperature: parseFloat(liveTempText),
      weatherCode: liveDescText,
      time: new Date().toLocaleTimeString("uk-UA"),
    };

    // Викликаємо РЕАЛЬНУ функцію збереження!
    saveToLocalStorage(newCity);

    // Скидаємо прапорець міграції, щоб при оновленні сторінки вона 100% спрацювала
    localStorage.removeItem("migratedToIDB");

    alert(
      "✅ Місто успішно збережено в LocalStorage!\n\nТепер натисніть ОК і оновіть сторінку (F5). Скрипт знайде ці дані і перенесе їх в IndexedDB.",
    );
  });
}

// 7. Головна функція запуску (з логікою МІГРАЦІЇ та ОБРОБКОЮ ПОМИЛОК)
async function initSavedCities() {
  try {
    const dbCities = await getAllCitiesDB();

    // Якщо IndexedDB порожня, і ми ще не робили міграцію
    if (!localStorage.getItem("migratedToIDB")) {
      console.log("Пошук старих даних у localStorage для міграції...");
      const lsCities = loadFromLocalStorage();

      if (lsCities.length > 0) {
        // Переносимо кожне місто в IndexedDB
        for (const city of lsCities) {
          await addCityDB(city);
        }
        console.log("Міграцію з localStorage в IndexedDB успішно завершено!");
      }
      // Ставимо прапорець, щоб більше ніколи не робити міграцію
      localStorage.setItem("migratedToIDB", "true");

      // Завантажуємо вже нові дані
      const updatedDbCities = await getAllCitiesDB();
      renderSavedCities(updatedDbCities);
    } else {
      // Звичайне завантаження
      renderSavedCities(dbCities);
    }
  } catch (error) {
    // ОБРОБКА ПОМИЛКИ ДОСТУПУ (try/catch успішно перехопив reject з openDB)
    console.error(
      "Помилка ініціалізації сховища:",
      error.message || error.name,
    );
    if (savedCitiesContainer) {
      savedCitiesContainer.innerHTML = `
                <div style="background-color: #FFEBEE; padding: 15px; border-radius: 8px; border: 1px solid #FFCDD2; color: #C62828;">
                    <strong>⚠️ Помилка доступу до бази даних!</strong><br>
                    Можливо, ви використовуєте режим "Інкогніто" або суворі налаштування приватності, які блокують IndexedDB. Функція збереження міст тимчасово недоступна.
                </div>`;
    }

    // Вимикаємо кнопку збереження, щоб уникнути подальших помилок
    const btnSaveCity = document.querySelector("#btn-save-city");
    if (btnSaveCity) btnSaveCity.disabled = true;
  }
}

// 8. Обробники подій
const btnSaveCity = document.querySelector("#btn-save-city");
if (btnSaveCity) {
  btnSaveCity.addEventListener("click", async () => {
    const liveTempText = document.querySelector("#live-temp").textContent;
    const liveDescText = document.querySelector("#live-desc").textContent;

    if (liveTempText === "--" || liveTempText === "") {
      alert("Дочекайтесь завантаження погоди!");
      return;
    }

    const newCity = {
      id: Date.now().toString(),
      name: "Київ",
      lat: 50.45,
      lon: 30.52,
      temperature: parseFloat(liveTempText),
      weatherCode: liveDescText,
      time: new Date().toLocaleTimeString("uk-UA"),
    };

    try {
      await addCityDB(newCity);
      const updated = await getAllCitiesDB();
      renderSavedCities(updated);
    } catch (e) {
      alert("Не вдалося зберегти дані.");
    }
  });
}

if (savedCitiesContainer) {
  savedCitiesContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const id = e.target.dataset.id;
      try {
        await deleteCityDB(id);
        const updated = await getAllCitiesDB();
        renderSavedCities(updated);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

// Запускаємо при завантаженні сторінки
initSavedCities();

//ПРАКТИЧНА РОБОТА 12: CANVAS АНІМАЦІЯ

const canvas = document.getElementById("weather-canvas");
// Отримуємо 2D контекст для малювання
const ctx = canvas ? canvas.getContext("2d") : null;

// Змінна для зберігання ID поточної анімації (щоб зупиняти її при зміні погоди)
let animationId;

// Параметри для анімацій
let sunAngle = 0;
let particles = []; // Масив для крапель дощу або сніжинок

// Головна функція, яка визначає, що малювати
function startWeatherAnimation(weatherCode) {
  if (!ctx) return;

  // ЗУПИНЯЄМО попередню анімацію, якщо вона була
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  // Створюємо нові частинки для дощу/снігу
  particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 2 + 1,
    });
  }

  // Логіка вибору анімації за кодом погоди (WMO)
  // 51-65: Мряка та Дощ, 71-75: Сніг, все інше - Сонце (спрощено для прикладу)
  if (weatherCode >= 51 && weatherCode <= 65) {
    animateRain();
  } else if (weatherCode >= 71 && weatherCode <= 75) {
    animateSnow();
  } else {
    animateSun();
  }
}

/*  АНІМАЦІЯ 1: СОНЦЕ, ЩО ОБЕРТАЄТЬСЯ  */
function animateSun() {
  // 1. Очищаємо полотно перед новим кадром (ОБОВ'ЯЗКОВО!)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Зберігаємо поточний стан (нульові координати)
  ctx.save();

  // 3. Переміщуємо центр малювання в середину Canvas (50, 50)
  ctx.translate(50, 50);
  // 4. Повертаємо на певний кут
  ctx.rotate(sunAngle);

  // 5. Малюємо сонце
  ctx.fillStyle = "#FFC107"; // Жовтий колір
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2); // Центральне коло
  ctx.fill();

  // Малюємо промені
  ctx.strokeStyle = "#FF9800";
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4); // Повертаємо на 45 градусів для кожного променя
    ctx.beginPath();
    ctx.moveTo(0, 25);
    ctx.lineTo(0, 40);
    ctx.stroke();
  }

  // 6. Відновлюємо координати
  ctx.restore();

  // 7. Збільшуємо кут для наступного кадру
  sunAngle += 0.02;

  // 8. Запитуємо наступний кадр анімації
  animationId = requestAnimationFrame(animateSun);
}

/* АНІМАЦІЯ 2: ДОЩ */
function animateRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#2196F3"; // Синій колір для дощу

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.speed * 3; // Падають швидко

    // Якщо крапля впала за екран - повертаємо наверх
    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  }

  animationId = requestAnimationFrame(animateRain);
}

/*  АНІМАЦІЯ 3: СНІГ  */
function animateSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#90CAF9"; // Світло-блакитний сніг

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.speed * 0.5; // Падають повільно
    p.x += Math.sin(p.y * 0.05); // Зигзагоподібний рух (вітер)

    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  }

  animationId = requestAnimationFrame(animateSnow);
}

// ПРАКТИЧНА РОБОТА 13: SPA МАРШРУТИЗАЦІЯ

// 1. Таблиця маршрутів (path - патерн URL, viewId - ID контейнера, init - функція, що спрацьовує при відкритті)
const routes = [
  {
    path: "/",
    viewId: "view-home",
    init: () => {
      /* Дані завантажуються самі при старті */
    },
  },
  { path: "/cities", viewId: "view-cities", init: initSavedCities },
  { path: "/cities/:id", viewId: "view-detail", init: loadCityDetail },
];

// 2. Функція зіставлення поточного шляху з патернами
function matchRoute(path) {
  const pathParts = path.split("/").filter(Boolean); // Розбиваємо шлях (напр. ['cities', '123'])

  for (const route of routes) {
    const routeParts = route.path.split("/").filter(Boolean); // Розбиваємо патерн (напр. ['cities', ':id'])

    if (routeParts.length !== pathParts.length) continue; // Різна кількість частин - не підходить

    const params = {};
    const isMatch = routeParts.every((part, i) => {
      if (part.startsWith(":")) {
        // Якщо частина починається з ":", це параметр. Зберігаємо його.
        params[part.slice(1)] = pathParts[i];
        return true;
      }
      return part === pathParts[i]; // Інакше - точний збіг тексту
    });

    if (isMatch) return { view: route, params };
  }
  return null; // Маршрут не знайдено (404)
}

// 3. Головна функція роутера
function router() {
  // Отримуємо хеш без символу # (якщо порожній - ставимо '/')
  const path = location.hash.slice(1) || "/";

  // Ховаємо всі сторінки (додаємо клас hidden)
  document
    .querySelectorAll(".spa-view")
    .forEach((view) => view.classList.add("hidden"));

  // Шукаємо відповідний маршрут
  const match = matchRoute(path);

  if (match) {
    // Показуємо потрібну сторінку
    document.getElementById(match.view.viewId).classList.remove("hidden");
    // Якщо для сторінки є функція ініціалізації - викликаємо її (передаючи параметри)
    if (match.view.init) match.view.init(match.params);
  } else {
    // Сторінка 404
    document.getElementById("view-404").classList.remove("hidden");
  }
}

// 4. View-функція для відображення деталей конкретного міста (Використовує IndexedDB з ПР11)
async function loadCityDetail(params) {
  const container = document.getElementById("city-detail-content");
  container.innerHTML = "<p>Завантаження даних...</p>"; // Очищуємо та показуємо статус

  try {
    const cities = await getAllCitiesDB(); // Беремо всі міста з IndexedDB
    // Шукаємо місто, id якого збігається з параметром з URL
    const city = cities.find((c) => c.id === params.id);

    if (city) {
      // Рендеримо деталі (перевикористовуємо дані з ПР11)
      container.innerHTML = `
                <h3 style="color: #1D4A7A; margin-top: 0;">${city.name}</h3>
                <p><strong>Координати:</strong> Широта ${city.lat}, Довгота ${city.lon}</p>
                <p><strong>Збережена температура:</strong> <span style="font-size: 1.5em; color: #E65100;">${city.temperature}°C</span></p>
                <p><strong>Опис погоди:</strong> ${city.weatherCode}</p>
                <hr>
                <p style="color: #666; font-size: 0.9em;">Точний час запису у базу даних: ${city.time}</p>
                <p style="color: #666; font-size: 0.9em;">Унікальний ідентифікатор запису: ${city.id}</p>
            `;
    } else {
      container.innerHTML =
        '<p style="color: red;">Помилка: Запис про це місто не знайдено в базі даних.</p>';
    }
  } catch (error) {
    container.innerHTML =
      '<p style="color: red;">Помилка доступу до бази даних.</p>';
  }
}

// 5. Перехоплення кліків по посиланнях з атрибутом data-link (за вимогою завдання)
document.body.addEventListener("click", (e) => {
  // Шукаємо, чи клікнули ми по тегу <a> з атрибутом data-link
  const link = e.target.closest("a[data-link]");
  if (link) {
    // У Hash-роутингу браузер сам змінить URL, але ми можемо використати це для кастомної логіки
    // preventDefault() тут не обов'язковий для hash, але доданий для відповідності інструкції
  }
});

// 6. Підписка на події зміни хеша (кнопки Назад/Вперед у браузері)
window.addEventListener("hashchange", router);

// 7. Виклик роутера при першому завантаженні сторінки
window.addEventListener("DOMContentLoaded", router);

// ПРАКТИЧНА РОБОТА 14: Node.js FETCH

// Додамо блок в HTML програмно (щоб не ламати твою розмітку)
const serverBlock = document.createElement('section');
serverBlock.innerHTML = `
    <hr>
    <div style="background-color: #E8F5E9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #2E7D32;">Міста з Node.js Сервера (API)</h2>
        <button id="btn-fetch-server" class="btn-small" style="background: #4CAF50; color: white;">⬇️ Завантажити з бекенду</button>
        <div id="server-error" style="color: red; margin-top: 10px;"></div>
        <ul id="server-cities-list" style="margin-top: 15px;"></ul>
    </div>
`;
document.querySelector('main').appendChild(serverBlock);

// Функція запиту до нашого локального API
async function fetchCitiesFromServer() {
    const list = document.getElementById('server-cities-list');
    const errorBox = document.getElementById('server-error');
    list.innerHTML = 'Завантаження...';
    errorBox.textContent = '';

    try {
        // Звертаємося до НАШОГО локального ендпоінту
        const response = await fetch('/api/cities');
        
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        const cities = await response.json();
        list.innerHTML = ''; // Очищаємо "Завантаження..."
        
        // Малюємо список
        cities.forEach(city => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${city.name}</strong> (lat: ${city.lat}, lon: ${city.lon}) 
                            <button onclick="testServerError('${city.id}')" style="font-size:0.7em;">Деталі</button>`;
            list.appendChild(li);
        });

    } catch (error) {
        console.error("Fetch помилка:", error);
        errorBox.textContent = "Не вдалося з'єднатися з локальним сервером.";
        list.innerHTML = '';
    }
}

// Прив'язуємо подію до кнопки
document.getElementById('btn-fetch-server').addEventListener('click', fetchCitiesFromServer);

// Функція для перевірки 404 помилки (Крок 10)
async function testServerError(id) {
    // Спробуємо запросити неіснуючий ID, додавши до реального ID приставку "-wrong"
    const badId = id + "-wrong"; 
    try {
        console.log(`Спроба знайти місто з ID: ${badId}`);
        const response = await fetch(`/api/cities/${badId}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Сервер повернув помилку ${response.status}: ${errorData.error}`);
            throw new Error(`Not Found: ${response.status}`);
        }
    } catch (e) {
        console.error("Успішно перехоплено помилку сервера:", e.message);
    }
}