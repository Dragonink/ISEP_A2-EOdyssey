package isep.softwareengineering.eodyssey.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
