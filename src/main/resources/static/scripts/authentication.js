const USER_PROPERTIES = ["id", "username"];
function checkUserProperties() {
	const userProperties = decodeURIComponent(document.cookie)
		.split("; ")
		.filter(cookie => /^user_\w+=/.test(cookie));
	return userProperties.length > 0 && userProperties.every(cookie => {
		const [cookieName, value] = cookie.split("=");
		const name = /^user_(\w+)$/.exec(cookieName);
		return name && USER_PROPERTIES.includes(name[1]) && value && value !== "";
	});
}
function getUserProperty(property) {
	return decodeURIComponent(document.cookie)
		.split("; ")
		.find(cookie => cookie.startsWith(`user_${property}=`))
		.split("=")[1];
}

function clearSession() {
	USER_PROPERTIES.forEach(property => {
		document.cookie = `user_${property}=;secure;samesite=strict`;
	});
}
function fillProfile() {
	/** @type {HTMLDivElement} */
	const forms = document.querySelector("div#unknown-user");
	forms.hidden = true;
	/** @type {HTMLDivElement} */
	const profile = document.querySelector("div#logged-user");
	profile.querySelector("h1#username").dataset.value = getUserProperty("username");
	profile.querySelector("button#signout").onclick = _event => {
		profile.hidden = true;
		clearSession();
		forms.hidden = false;
	};
	/** @type {HTMLFormElement} */
	const editProfileForm = profile.querySelector("form#edit-profile-form");
	const editProfileOutput = editProfileForm.querySelector("output");
	editProfileForm.onsubmit = event => {
		event.preventDefault();
		editProfileOutput.hidden = true;
		fetch(editProfileForm.action + getUserProperty("id"), {
			method: "PATCH",
			body: new FormData(editProfileForm),
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw response;
				}
			})
			.then(setupSession)
			.catch(error => {
				if (error) {
					console.error(error);
				}
				editProfileOutput.hidden = false;
			});
	};
	profile.hidden = false;
}
function setupSession(user) {
	USER_PROPERTIES.forEach(property => {
		document.cookie = `user_${property}=${user[property]};secure;samesite=strict`;
	});
	fillProfile();
}

document.querySelectorAll("div#unknown-user>form").forEach((/** @type {HTMLFormElement} */ form) => {
	const output = form.querySelector("output");
	form.onsubmit = event => {
		event.preventDefault();
		output.hidden = true;
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
			.then(user => {
				if (user) {
					return user;
				} else {
					throw TypeError("Fetched null user");
				}
			})
			.then(setupSession)
			.catch(error => {
				if (error) {
					console.error(error);
				}
				output.hidden = false;
			});
	};
});

if (checkUserProperties()) {
	fillProfile();
}
