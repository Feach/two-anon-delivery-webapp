// app.js

const tg = window.Telegram.WebApp;
tg.expand();

const params = new URLSearchParams(window.location.search);
let role = params.get("role");

// ✅ Fallback: если role не пришёл — спросим пользователя
if (!role) {
  const choice = confirm("Вы выбираете ПВЗ отправителя?\nOK = отправитель, Cancel = получатель");
  role = choice ? "sender" : "receiver";
}

const map = L.map("map").setView([55.751244, 37.618423], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

fetch("pvz.json")
  .then((response) => response.json())
  .then((pvzList) => {
    pvzList.forEach((pvz) => {
      const marker = L.marker([pvz.lat, pvz.lon]).addTo(map);
      marker.bindPopup(pvz.name);

      marker.on("click", () => {
        const payload = {
          role: role,
          platform_station_id: pvz.platform_station_id,
        };

        tg.sendData(JSON.stringify(payload));
      });
    });
  })
  .catch(() => alert("Ошибка загрузки ПВЗ"));
