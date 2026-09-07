package com.nba.nba_zone;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class NbaZoneApplication {

	/**
	 * Settings read from {@code .env} during local development. In a deployed
	 * environment these arrive as real environment variables instead.
	 */
	private static final List<String> DOTENV_KEYS = List.of(
			"DB_URL",
			"DB_USERNAME",
			"DB_PASSWORD",
			"ADMIN_USERNAME",
			"ADMIN_PASSWORD",
			"ALLOWED_ORIGINS");

	public static void main(String[] args) {
		loadDotenv();
		SpringApplication.run(NbaZoneApplication.class, args);
	}

	/**
	 * Copies {@code .env} entries into system properties for local runs.
	 *
	 * <p>The file is optional: a deployment sets real environment variables and
	 * ships no {@code .env} at all, and the previous version threw on startup in
	 * exactly that case. A real environment variable always wins over the file,
	 * so a production value can never be shadowed by a stale local one.
	 */
	private static void loadDotenv() {
		Dotenv dotenv = Dotenv.configure()
				.filename(".env")
				.ignoreIfMissing()
				.ignoreIfMalformed()
				.load();

		for (String key : DOTENV_KEYS) {
			if (System.getenv(key) != null) {
				continue;
			}
			String value = dotenv.get(key);
			if (value != null && !value.isBlank()) {
				System.setProperty(key, value);
			}
		}
	}

}
