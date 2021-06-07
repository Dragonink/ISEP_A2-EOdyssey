const MAP = L.map('map').setView([48.82461184925993, 2.279912667672016], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(MAP);

const SIDEBAR = L.control.sidebar({
	container: 'sidebar',
	closeButton: false,
}).addTo(MAP);

fetch("/api/markers")
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw response;
		}
	})
	.then(markers => markers.forEach(marker => {
		L.marker([marker.latitude, marker.longitude])
			.addTo(MAP)
			.bindPopup(marker.content);
	}))
	.catch(console.error);

((/** @type {HTMLFormElement} */ form) => {
	form.onsubmit = event => {
		event.preventDefault();
		fetch(`${form.action}?${new URLSearchParams({
			query: form.elements.namedItem("query").value,
		})}`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw response;
				}
			})
			.then(markers => {
				/** @type {HTMLUListElement} */
				const output = document.querySelector("output[form='search-form']>ul");
				output.innerHTML = "";
				markers.forEach(marker => {
					const li = document.createElement("li");
					const button = document.createElement("button");
					button.textContent = marker.content;
					button.onclick = _event => void MAP.flyTo([marker.latitude, marker.longitude], 14);
					li.appendChild(button);
					output.appendChild(li);
				});
			})
			.catch(console.error);
	};
})(document.querySelector("form#search-form"));
