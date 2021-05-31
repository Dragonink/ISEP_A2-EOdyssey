package isep.softwareengineering.eodyssey.models;

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

	public double latitude;

	public double longitude;

	public String content;

	Marker() {}
	public Marker(double latitude, double longitude, String content) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.content = content;
	}
}
