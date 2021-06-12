package isep.softwareengineering.eodyssey.controllers.websocket;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import isep.softwareengineering.eodyssey.models.Marker;
import isep.softwareengineering.eodyssey.models.MarkerRepository;

public class MeetingHandler extends TextWebSocketHandler {
	private MarkerRepository markerRepository;

	private static final String[] PATHS = new String[] {"\\/ws\\/meeting\\/(\\d+)"};
	public static final String[] getPaths() {
		return List.of(PATHS).stream()
			.map(re -> re
				.replaceAll(Pattern.quote("(\\d+)"), "*")
				.replaceAll(Pattern.quote("\\/"), "/")
			)
			.collect(Collectors.toList())
			.toArray(new String[0]);
	}
	protected final Optional<Marker> parseMarker(String requestPath) {
		StringBuilder re = new StringBuilder();
		List.of(PATHS).forEach(path -> {
			if (re.length() > 0) {
				re.append("|");
			}
			re.append(path);
		});
		Matcher matcher = Pattern.compile(re.toString()).matcher(requestPath);
		matcher.matches();
		return Optional.ofNullable(
			matcher
				.group(1)
		)
			.map(Long::valueOf)
			.flatMap(markerRepository::findById);
	}

	private final Map<Long, Set<WebSocketSession>> rooms = new HashMap<Long, Set<WebSocketSession>>();
	private final Map<String, Long> sessionMap = new HashMap<String, Long>();

	public MeetingHandler(MarkerRepository markerRepository) {
		this.markerRepository = markerRepository;
	}

	protected final Optional<Set<WebSocketSession>> getSessionRoom(WebSocketSession session) {
		return Optional.ofNullable(sessionMap.get(session.getId()))
			.map(rooms::get);
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session)
	throws Exception {
		parseMarker(session.getUri().getPath()).ifPresent(marker -> {
			Optional.ofNullable(rooms.get(marker.getId()))
				.ifPresentOrElse(room -> {
					room.add(session);
				}, () -> {
					Set<WebSocketSession> set = new HashSet<WebSocketSession>();
					set.add(session);
					rooms.put(marker.getId(), set);
					marker.hasMeeting = true;
					markerRepository.save(marker);
				});
			sessionMap.put(session.getId(), marker.getId());
		});
		super.afterConnectionEstablished(session);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message)
	throws Exception {
		super.handleTextMessage(session, message);
		getSessionRoom(session).ifPresent(room -> room.forEach(peer -> {
			try {
				peer.sendMessage(message);
			} catch (IOException error) {
				error.printStackTrace();
			}
		}));
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
	throws Exception {
		getSessionRoom(session).ifPresent(room -> {
			room.remove(session);
			if (room.isEmpty()) {
				long markerId = sessionMap.get(session.getId());
				markerRepository.findById(markerId)
					.ifPresent(marker -> {
						marker.hasMeeting = false;
						markerRepository.save(marker);
					});
				rooms.remove(markerId);
			}
		});
		sessionMap.remove(session.getId());
		super.afterConnectionClosed(session, status);
	}
}
