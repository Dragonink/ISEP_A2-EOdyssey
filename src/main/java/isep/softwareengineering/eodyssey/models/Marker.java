package isep.softwareengineering.eodyssey.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Marker {
	@Id
	@GeneratedValue
	private long id;
	public long getId() {
		return id;
	}

	@Column(nullable = false)
	public String title;

	@Column(nullable = false)
	public double latitude;

	@Column(nullable = false)
	public double longitude;

	public String content;

	Marker() {}
	public Marker(String title, double latitude, double longitude, String content) {
		this.title = title;
		this.latitude = latitude;
		this.longitude = longitude;
		this.content = content;
	}
}
