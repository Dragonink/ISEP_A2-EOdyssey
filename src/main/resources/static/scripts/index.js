const MAP = L.map('map').setView([48.82461184925993, 2.279912667672016], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(MAP);

const SIDEBAR = L.control.sidebar({
	container: 'sidebar',
	closeButton: false,
}).addTo(MAP);

const ICONS = ["blue", "gold", "red", "green", "orange", "yellow", "violet", "grey", "black"].reduce((obj, color) => {
	obj[color] = L.icon({
		iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
		iconSize: [25, 41],
		iconAnchor: [12, 41],
	});
	return obj;
}, {});

let selectedMarker = null;
function displayMarkerDetails(marker) {
	document.querySelector("article").innerHTML = `<h1>${marker.title}</h1><p>${marker.content}</p>`;
	MAP.eachLayer(layer => {
		if (layer.options && layer.options.id) {
			if (layer.options.id === selectedMarker) {
				layer.setIcon(ICONS["blue"]);
			}
			if (layer.options.id === marker.id) {
				layer.setIcon(ICONS["red"]);
			}
		}
	});
	selectedMarker = marker.id;
	SIDEBAR.open("marker-details");
}

fetch("/api/markers")
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw response;
		}
	})
	.then(markers => markers.forEach(marker => {
		L.marker([marker.latitude, marker.longitude], {
			id: marker.id,
			title: marker.title,
			icon: ICONS["blue"],
		})
			.addTo(MAP)
			.on("click", _event => displayMarkerDetails(marker));
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
					button.textContent = marker.title;
					button.onclick = _event => {
						MAP.flyTo([marker.latitude, marker.longitude], 14);
						displayMarkerDetails(marker);
					};
					li.appendChild(button);
					output.appendChild(li);
				});
			})
			.catch(console.error);
	};
})(document.querySelector("form#search-form"));
