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
	public static String encryptPassword(String password) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			digest.update(password.getBytes());
			return new String(digest.digest());
		} catch (NoSuchAlgorithmException error) {
			return null;
		}
	}
	public boolean checkPassword(String password) {
		return encryptPassword(password).equals(this.password);
	}
	public void setPassword(String password) {
		this.password = encryptPassword(password);
	}

	User() {}
	public User(String username, String password) {
		this.username = username;
		setPassword(password);
	}
}
