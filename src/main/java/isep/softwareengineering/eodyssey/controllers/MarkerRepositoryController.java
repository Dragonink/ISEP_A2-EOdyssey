package isep.softwareengineering.eodyssey.controllers;

import java.util.Optional;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
					.filter(marker -> marker.content.contains(str))
					.iterator();
				return iter;
			})
			.orElseGet(() -> repository.findAll());
	}
}
