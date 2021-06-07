package isep.softwareengineering.eodyssey.models;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {
	@Id
	@GeneratedValue
	private long id;
	public long getId() {
		return id;
	}

	@Column(nullable = false, unique = true)
	public String username;

	@Column(nullable = false)
	private String password;
	public boolean checkPassword(String password) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			digest.update(password.getBytes());
			return this.password.equals(new String(digest.digest()));
		} catch (NoSuchAlgorithmException error) {
			return false;
		}
	}
	public void setPassword(String password) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			digest.update(password.getBytes());
			this.password = new String(digest.digest());
		} catch (NoSuchAlgorithmException error) {}
	}

	User() {}
	public User(String username, String password) {
		this.username = username;
		setPassword(password);
	}
}
