const tg = window.Telegram.WebApp;
tg.expand();

const role = new URLSearchParams(window.location.search).get("role");

const map = L.map("map").setView([55.751244, 37.618423], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

fetch("pvz.json")
  .then(r => r.json())
  .then(pvzList => {
    pvzList.forEach(pvz => {
      const marker = L.marker([pvz.lat, pvz.lon]).addTo(map);
      marker.bindPopup(pvz.name);

      marker.on("click", () => {
        tg.sendData(JSON.stringify({
          role: role,
          platform_station_id: pvz.platform_station_id
        }));
      });
    });
  });
