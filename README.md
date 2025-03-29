# NBA Zone
This is a web application that provides users with an intuitive interface to explore, search, and analyze NBA player statistics.

# Backend Implementation Overview

This backend is implemented using **Java Spring Boot** and utilizes a RESTful architecture to serve NBA player statistics. 
The key components include:
- Spring Boot REST API: Provides endpoints to retrieve, add, update, and delete player information.
- Spring JPA & Hibernate: Used for database interactions with **PostgreSQL**, ensuring smooth data persistence and retrieval.
 - Spring Data JPA Repository: Simplifies data access through the PlayerRepository interface.
- Entity Mapping: Utilizes JPA Entity (Player.java) mapping to the player_stats database table. 

# Features

- Flexible Data Queries: Supports filtering player data by attributes such as player name, team abbreviation, college, country, and season.
- CRUD Operations: Implements REST endpoints for creating, reading, updating, and deleting player records.

# Example

![image](https://github.com/user-attachments/assets/afb38308-4bc3-41b0-a51d-94118bfc92bd)


# Frontend Implementation Overview

The frontend of the application is built with **Next.js 14 (App Router)** and styled using **Tailwind CSS** and **ShadCN UI** for a modern, responsive, and accessible user experience. It provides a seamless interface for users to explore, filter, and analyze NBA player data.

## Tech Stack
- **Next.js 14** 
- **TypeScript** 
- **Tailwind CSS** 
- **ShadCN UI**
- **Framer Motion** 
- **Sonner** 
- **Axios**

## Pages & Features

### 🏠 Home Page
- Highlights key features of the platform (Player Stats, Draft Insights, Global View)
- Animations using Framer Motion
- Fully responsive layout with mobile-first design
 
![image](https://github.com/user-attachments/assets/aa0d1125-8e60-47e7-80f5-420ecee47819)

### 🏀 Teams Page
- Interactive grid of all 30 NBA teams
- Team search functionality
- Clicking a team shows all players on that team in a sortable stats table

![image](https://github.com/user-attachments/assets/659a81e4-fb8c-4e48-bab4-86c172b8098c)
![image](https://github.com/user-attachments/assets/ea3098e7-b134-4272-ba97-4f7585420973)

### 🌍 Countries Page
- Dynamically loads countries using RestCountries API
- Shows a flag grid and number of players per country
- Clicking a country displays player data in a scrollable stats table

![image](https://github.com/user-attachments/assets/d2527f04-65ea-45cb-bb1a-7dd87d14158a)
![image](https://github.com/user-attachments/assets/f8b24244-348e-4c20-9f43-27b292098211)

### 📅 Seasons Page
- Search for players by NBA season (e.g., 2022-23)
- Displays all players and stats for the selected season
  
![image](https://github.com/user-attachments/assets/2cdbe9cd-9694-4f2b-9fcf-9d91cd114e46)

### 🔍 Player Search
- Advanced multi-criteria search using player name, team, college, season, and country
- Team selection powered by ShadCN combobox
- Search results update the URL for shareability (e.g., `/players/search?teamName=OKC&country=Canada`)
- Clear all filters with a single button

![image](https://github.com/user-attachments/assets/d206b295-5555-4b84-8c0c-38bb383fab5e)

## Components
- `PlayerStatsTable` – Sortable, responsive stats table with click-to-view player details
- `PlayerDetailsModal` – Detailed view of a selected player's info and stats
- `BackButton` – Consistent back-navigation for all detail pages
- `FloatingInputField` – Reusable form inputs with floating labels and icons
- `TeamCombobox` – Combobox with search and clear functionality for selecting NBA teams


