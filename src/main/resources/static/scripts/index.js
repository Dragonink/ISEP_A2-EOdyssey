const MAP = L.map('map').setView([48.82461184925993, 2.279912667672016], 13);
const markers = [];
function setMarkers(newMarkers) {
	markers.forEach(marker => {
		marker.remove();//FIXME 'remove' does not work
	});
	newMarkers.forEach(marker => void markers.push(
		L.marker([marker.latitude, marker.longitude])
			.addTo(MAP)
			.bindPopup(marker.content)
	));
}

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
	.then(setMarkers)
	.catch(console.error);

((/** @type {HTMLFormElement} */ form) => {
	form.onsubmit = event => {
		event.preventDefault();
		fetch(form.action)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw response;
				}
			})
			.then(setMarkers)
			.catch(console.error);
	};
})(document.querySelector("form#search"));
