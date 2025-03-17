# nba-players-stats
This is a web application that provides users with an intuitive interface to explore, search, and analyze NBA player statistics.

# Backend Implementation Overview

This backend is implemented using Java Spring Boot and utilizes a RESTful architecture to serve NBA player statistics. 
The key components include:
- Spring Boot REST API: Provides endpoints to retrieve, add, update, and delete player information.
- Spring JPA & Hibernate: Used for database interactions with PostgreSQL, ensuring smooth data persistence and retrieval.
 - Spring Data JPA Repository: Simplifies data access through the PlayerRepository interface.
- Entity Mapping: Utilizes JPA Entity (Player.java) mapping to the player_stats database table. 

# Features

- Flexible Data Queries: Supports filtering player data by attributes such as player name, team abbreviation, college, country, and season.
- CRUD Operations: Implements REST endpoints for creating, reading, updating, and deleting player records.

# Example

![image](https://github.com/user-attachments/assets/afb38308-4bc3-41b0-a51d-94118bfc92bd)
