const MAP = L.map('map').setView([48.82461184925993, 2.279912667672016], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(MAP);

fetch("/api/markers")
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw response;
		}
	})
	.then(markers => {
		markers.forEach(marker => (
			L.marker([marker.latitude, marker.longitude])
				.addTo(MAP)
				.bindPopup(marker.content)
		));
	})
	.catch(console.error);
