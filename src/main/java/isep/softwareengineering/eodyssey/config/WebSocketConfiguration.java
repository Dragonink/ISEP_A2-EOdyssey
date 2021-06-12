package isep.softwareengineering.eodyssey.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import isep.softwareengineering.eodyssey.controllers.websocket.MeetingHandler;
import isep.softwareengineering.eodyssey.models.MarkerRepository;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {
	@Autowired
	private MarkerRepository markerRepository;

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry
			.addHandler(new MeetingHandler(markerRepository), MeetingHandler.getPaths());
	}
}
