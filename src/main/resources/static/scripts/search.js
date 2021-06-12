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
