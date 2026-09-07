package com.nba.nba_zone;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Runs against in-memory H2 via the "test" profile, so it no longer needs a live
 * PostgreSQL instance reachable at DB_URL.
 */
@SpringBootTest
@ActiveProfiles("test")
class NbaZoneApplicationTests {

	@Test
	void contextLoads() {
	}

}
