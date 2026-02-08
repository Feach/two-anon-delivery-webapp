// app/webapp/app.js

const tg = window.Telegram.WebApp;
tg.expand();

// Получаем роль из URL (?role=sender / receiver)
const params = new URLSearchParams(window.location.search);
const role = params.get("role");

if (!role) {
  alert("Ошибка: не передана роль (sender / receiver)");
}

// Инициализация карты
const map = L.map("map").setView([55.751244, 37.618423], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// Загружаем ПВЗ
fetch("pvz.json")
  .then((response) => response.json())
  .then((pvzList) => {
    pvzList.forEach((pvz) => {
      const marker = L.marker([pvz.lat, pvz.lon]).addTo(map);
      marker.bindPopup(pvz.name);

      marker.on("click", () => {
        const payload = {
          role: role, // ОБЯЗАТЕЛЬНО
          platform_station_id: pvz.platform_station_id, // ОБЯЗАТЕЛЬНО
        };

        console.log("SEND TO BOT:", payload);

        // Отправляем данные в Telegram-бот
        tg.sendData(JSON.stringify(payload));
      });
    });
  })
  .catch((err) => {
    console.error("Ошибка загрузки pvz.json", err);
    alert("Ошибка загрузки ПВЗ");
  });
