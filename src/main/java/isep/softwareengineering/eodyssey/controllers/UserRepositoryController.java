package isep.softwareengineering.eodyssey.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import isep.softwareengineering.eodyssey.models.User;
import isep.softwareengineering.eodyssey.models.UserRepository;

@Controller
@RequestMapping(path = "/api/users")
public class UserRepositoryController {
	@Autowired
	private UserRepository repository;

	@PostMapping(path = "/signup", consumes = {"multipart/form-data"})
	public @ResponseBody User signUp(
		@RequestParam("username") String username,
		@RequestParam("password") String password
	) {
		User user = new User(username, password);
		return repository.save(user);
	}

	@PostMapping(path = "/signin", consumes = {"multipart/form-data"})
	public @ResponseBody Optional<User> signIn(
		@RequestParam("username") String username,
		@RequestParam("password") String password
	) {
		return repository.findByUsername(username)
			.map(user -> user.checkPassword(password) ? user : null);
	}

	@PatchMapping(path = "/{id}", consumes = {"multipart/form-data"})
	public @ResponseBody Optional<User> patch(
		@PathVariable("id") long id,
		@RequestParam("password") String oldPassword,
		@RequestParam("username") Optional<String> username,
		@RequestParam("password") Optional<String> password
	) {
		return repository.findById(id).map(user -> {
			if (user.checkPassword(oldPassword)) {
				username.ifPresent(value -> user.username = value);
				password.ifPresent(user::setPassword);
				return repository.save(user);
			} else {
				return null;
			}
		});
	}
}
