const MAP = L.map('map').setView([48.82461184925993, 2.279912667672016], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(MAP);

L.marker([48.82461184925993, 2.279912667672016]).addTo(MAP)
	.bindPopup('ISEP')
	.openPopup();
