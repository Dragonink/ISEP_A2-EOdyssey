package isep.softwareengineering.eodyssey.controllers;

import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import isep.softwareengineering.eodyssey.models.Marker;
import isep.softwareengineering.eodyssey.models.MarkerRepository;

@Controller
@RequestMapping(path = "/api/markers")
public class MarkerRepositoryController {
	@Autowired
	private MarkerRepository repository;

	@GetMapping
	public @ResponseBody Iterable<Marker> getAll() {
		return repository.findAll();
	}

	@GetMapping(path = "/search")
	public @ResponseBody Iterable<Marker> search(
		@RequestParam("query") Optional<String> query
	) {
		return query
			.map(str -> {
				Iterable<Marker> iter = () -> StreamSupport.stream(repository.findAll().spliterator(), false)
					.filter(marker ->
						Pattern.compile(Pattern.quote(str), Pattern.CASE_INSENSITIVE)
							.matcher(marker.title)
							.find()
					)
					.iterator();
				return iter;
			})
			.orElseGet(() -> repository.findAll());
	}

	@PostMapping
	@ResponseStatus(code = HttpStatus.CREATED)
	public @ResponseBody Marker add(
		@RequestParam("title") String title,
		@RequestParam("latitude") double latitude,
		@RequestParam("longitude") double longitude,
		@RequestParam("content") String content
	) {
		Marker marker = new Marker(title, latitude, longitude, content);
		return repository.save(marker);
	}
}
