let WS;
function openMeeting(markerId) {
	const meeting = document.querySelector("div#meeting");
	const messageList = meeting.querySelector("ul");
	const sendForm = meeting.querySelector("form");
	function displayMessage(innerHTML) {
		const li = document.createElement("li");
		li.innerHTML = innerHTML;
		messageList.appendChild(li);
	}

	WS = new WebSocket(`ws://${location.host}/ws/meeting/${markerId}`);
	WS.onerror = console.error;
	WS.onopen = _event => {
		SIDEBAR.enablePanel("meeting");
		sendForm.onsubmit = event => {
			event.preventDefault();
			const textarea = sendForm.elements.namedItem("content");
			WS.send(textarea.value);
		};
		SIDEBAR.open("meeting");
		displayMessage("<i>Connected</i>");
	};
	WS.onmessage = event => displayMessage(event.data);
	WS.onclose = _event => {
		messageList.innerHTML = "";
		sendForm.onsubmit = _event => { };
		SIDEBAR.close("meeting");
		SIDEBAR.disablePanel("meeting");
	};
}
