package isep.softwareengineering.eodyssey.models;

import java.util.Optional;
import java.util.stream.StreamSupport;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
	default Optional<User> findByUsername(String username) {
		return StreamSupport.stream(findAll().spliterator(), false)
			.filter(user -> user.username.equals(username))
			.findFirst();
	}
}
