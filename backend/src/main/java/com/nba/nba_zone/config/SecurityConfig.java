package com.nba.nba_zone.config;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Locks down the write side of the API.
 *
 * <p>Reads stay public: the frontend calls the GET endpoints anonymously and
 * has no login flow. Every mutating request (POST/PUT/DELETE) now requires the
 * admin credentials over HTTP Basic.
 *
 * <p>The previous {@code @CrossOrigin("http://localhost:3000")} annotation was
 * the only thing standing in front of the write endpoints, and CORS is enforced
 * by browsers alone — it never applied to curl, a script, or any non-browser
 * client. CORS is still configured here (so the frontend keeps working), but it
 * is no longer load-bearing for authorization.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SecurityProperties securityProperties;

    public SecurityConfig(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * The single admin account, sourced from the environment. The password is
     * hashed at startup so the plaintext is not held in the user store.
     */
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.withUsername(securityProperties.getAdminUsername())
                .password(passwordEncoder.encode(securityProperties.getAdminPassword()))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                // Safe to disable: authentication is HTTP Basic on a stateless
                // API. There is no cookie or session for a third-party site to
                // ride on, which is the thing CSRF protection defends against.
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Spring Boot renders errors by forwarding to /error on the
                        // ERROR dispatch. That forward goes through this filter chain,
                        // so without this rule an anonymous 404 is re-authorized,
                        // fails, and reaches the client as a misleading 401.
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        // Browsers send a credential-less preflight; it must not 401.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Both spellings: "/api/players/**" alone does not cover the
                        // bare "/api/players/" that a client with a trailing slash sends.
                        .requestMatchers(HttpMethod.GET, "/api/players", "/api/players/", "/api/players/**")
                        .permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        // Anything not explicitly opened above requires the admin.
                        .anyRequest().hasRole("ADMIN"))
                .httpBasic(Customizer.withDefaults())
                // Return a bare 401 instead of a WWW-Authenticate challenge, so a
                // browser hitting the API does not pop a native login dialog.
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny())
                        .contentSecurityPolicy(csp ->
                                csp.policyDirectives("default-src 'none'; frame-ancestors 'none'")));

        return http.build();
    }

    /**
     * Allowed origins come from configuration rather than a hardcoded
     * annotation, so a deployed frontend can be permitted without a code change.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(securityProperties.getAllowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
