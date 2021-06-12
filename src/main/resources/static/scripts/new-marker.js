((/** @type {HTMLFormElement} */ form) => {
	MAP.on("contextmenu", event => {
		form.elements.namedItem("latitude").value = event.latlng.lat;
		form.elements.namedItem("longitude").value = event.latlng.lng;
		SIDEBAR.enablePanel("new-marker");
		SIDEBAR.open("new-marker");
	});

	form.onsubmit = event => {
		event.preventDefault();
		fetch(form.action, {
			method: "POST",
			body: new FormData(form),
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw response;
				}
			})
			.then(marker => {
				addMarker(marker);
				SIDEBAR.close("new-marker");
				SIDEBAR.disablePanel("new-marker");
				displayMarkerDetails(marker);
			})
			.catch(alert);
	};
})(document.querySelector("form#new-marker-form"));
