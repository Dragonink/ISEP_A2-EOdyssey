let WS;
function openMeeting(marker) {
	if (checkUserProperties()) {
		const meeting = document.querySelector("div#meeting");
		const messageList = meeting.querySelector("ul");
		const sendForm = meeting.querySelector("form");
		/** @type {HTMLButtonElement} */
		const disconnect = sendForm.querySelector("button:not([type])");

		function displayMessage(data) {
			const li = document.createElement("li");
			if (data.system) {
				li.classList.add("system");
			}
			if (data.username) {
				li.dataset.username = data.username;
			}
			li.textContent = data.message;
			messageList.appendChild(li);
			li.scrollIntoView({
				behavior: "smooth",
				block: "end",
				inline: "nearest",
			});
		}

		if (WS) {
			WS.close();
		}
		WS = new WebSocket(`ws://${location.host}/ws/meeting/${marker.id}`);
		WS.onerror = console.error;
		WS.onopen = _event => {
			SIDEBAR.enablePanel("meeting");
			sendForm.onsubmit = event => {
				event.preventDefault();
				WS.send(JSON.stringify({
					username: getUserProperty("username"),
					message: sendForm.elements.namedItem("content").value,
				}));
			};
			SIDEBAR.open("meeting");
			WS.send(JSON.stringify({
				system: true,
				username: getUserProperty("username"),
				message: "joined",
			}));
			displayMessage({
				system: true,
				message: "CONNECTED TO " + marker.title,
			});
		};
		WS.onmessage = event => displayMessage(JSON.parse(event.data));
		WS.onclose = _event => {
			messageList.innerHTML = "";
			sendForm.onsubmit = _event => { };
			SIDEBAR.close("meeting");
			SIDEBAR.disablePanel("meeting");
		};

		disconnect.onclick = _event => {
			WS.send(JSON.stringify({
				system: true,
				username: getUserProperty("username"),
				message: "left",
			}));
			WS.close();
		};
	} else {
		SIDEBAR.open("user");
	}
}
