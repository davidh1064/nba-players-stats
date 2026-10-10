# NBA Zone
This is a web application that provides users with an intuitive interface to explore, search, and analyze NBA player statistics.

# Backend Implementation Overview

This backend is implemented using **Java Spring Boot** and utilizes a RESTful architecture to serve NBA player statistics. 

## Tech Stack
- **Spring Boot (Java)**– REST API framework for serving player data.
- **Spring Data JPA + Hibernate** – Handles ORM and interacts with a PostgreSQL database.
- **PostgreSQL** – Primary relational database used to store player statistics.
- **JPA Repositories** – Enable clean and abstracted data access via `PlayerRepository`.

# Features

- **Dynamic Query Handling**
Refactored controller logic to support all 31 possible combinations of up to 5 search filters (`playerName`, `teamName`, `college`, `country`, `season`) using a single service method.

- **Custom JPQL Queries for Performance**
Migrated filtering logic from in-memory stream operations to a custom `PlayerRepository` using JPQL dynamic query generation for more efficient and scalable searches across large datasets.

- **Entity Mapping & Schema Design**
The `Player` entity maps directly to the `player_stats` table, with clear mappings for fields like player name, team abbreviation, physical attributes, college, draft stats, and advanced metrics.

- **CRUD Operations**
Provides endpoints for Create, Read, Update, and Delete actions on player records.

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
- Lists every country in the dataset with its number of distinct players, from a single API call (`GET /api/players/countries`)
- Shows a flag grid (flags from [flagcdn.com](https://flagcdn.com)); countries with no current flag, such as Yugoslavia, show a globe placeholder
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



## Running locally

You need three things running: **PostgreSQL** (the data), the **backend**
(Spring Boot API on port 8080), and the **frontend** (Next.js on port 3000).

Run every command below from the **project folder** (the one containing
`backend/` and `frontend/`), e.g. `cd ~/nba-players-stats`, unless a step says
otherwise.

### 1. Install the tools (one time)

| Tool | Version | Check | Install (macOS) |
|---|---|---|---|
| Java | 21 | `java -version` | `brew install --cask temurin@21` (asks for your Mac password) |
| Node.js | 22.12+, 24 or 26 | `node -v` | the **LTS** installer from [nodejs.org](https://nodejs.org) |
| PostgreSQL | 14+ | `psql --version` | `brew install postgresql@14` |

- **Avoid Node 23 and 25.** The frontend test runner (Vitest 5) refuses them.
  LTS releases are always even-numbered, so the nodejs.org LTS installer is safe.
- **Why not `brew install openjdk@21` / `node@22`?** Homebrew installs those
  "keg-only": they are **not** put on your PATH, so `java` / `node` still won't
  be found afterwards. The cask and installer above need no extra setup. If you
  prefer `node@22`, also run this and then open a new terminal:
  ```bash
  echo 'export PATH="$(brew --prefix node@22)/bin:$PATH"' >> ~/.zshrc
  ```
- Maven is not needed. The backend ships its own (`./mvnw`).

### 2. Start PostgreSQL

```bash
brew services start postgresql@14
```

This also starts it automatically at login. Use `brew services run postgresql@14`
instead to run it only until you log out or reboot.

### 3. Load the player data (one time)

The data is not stored in this repository. It is the public Kaggle dataset
[**NBA Players**](https://www.kaggle.com/datasets/justinas/nba-players-data).
Sign in to Kaggle (free), download it, and unzip it to get `all_seasons.csv`.
Then load it:

```bash
backend/scripts/load-dataset.sh ~/Downloads/all_seasons.csv
```

This creates a local database named `nba` and fills its `player_stats` table.
The script:
- checks the file really is that dataset before loading anything;
- only connects to the PostgreSQL on your own machine, never the one in `.env`;
- refuses to overwrite existing rows unless you add `--replace`;
- loads all-or-nothing, so a failure leaves the table as it was.

### 4. Configure the backend (one time)

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set:

| Setting | Value |
|---|---|
| `DB_USERNAME` | On Homebrew, **your macOS username** (`whoami`). There is no `postgres` user on a Homebrew install. |
| `DB_PASSWORD` | Leave empty. Homebrew's local setup needs none. |
| `ADMIN_PASSWORD` | Required, at least 12 characters. Generate one with `openssl rand -base64 24`. |

`ADMIN_USERNAME` / `ADMIN_PASSWORD` protect the write endpoints. The backend
refuses to start without them rather than falling back to a default.
`backend/.env` is gitignored, so it never gets committed.

### 5. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

Leave this terminal open. It is ready when the log says `Started NbaZoneApplication`.
Check it from another terminal:

```bash
curl http://localhost:8080/api/players/countries
```

### 6. Start the frontend

Open a **second** terminal. New terminals start in your home folder, so go to
the project first (adjust the path if you cloned it elsewhere):

```bash
cd ~/nba-players-stats/frontend
npm ci        # first time, or after dependencies change
npm run dev
```

Open <http://localhost:3000>. To stop either server, press `Ctrl+C` in its terminal.

### Running the tests

```bash
(cd backend && ./mvnw verify)   # backend: in-memory database, no PostgreSQL needed
(cd frontend && npm test)       # frontend
```

The parentheses run each command in its own subshell, so you stay in the
project folder and can paste both lines at once.

### Troubleshooting

| Symptom | Fix |
|---|---|
| Backend: `FATAL: role "postgres" does not exist` | Set `DB_USERNAME` in `backend/.env` to your macOS username (`whoami`). |
| Backend: `Connection refused` to `localhost:5432` | PostgreSQL is not running: `brew services start postgresql@14`. |
| Backend: `app.security.admin-password is not set` | Set `ADMIN_PASSWORD` in `backend/.env` (step 4). |
| Backend: `Port 8080 was already in use` | Another backend is still running. Stop it with `Ctrl+C`, or find it with `lsof -i :8080`. |
| Pages load but show no players or countries | The data is not loaded (step 3), or the backend is not running. |
| Loader: `already has N rows` | Expected when re-running. Add `--replace` to reload. |
| Frontend talks to the wrong backend | Set `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` (see `frontend/.env.example`). |

## API access control

Reads are public. Writes require the admin credentials over HTTP Basic.

| Endpoint | Auth |
|---|---|
| `GET /api/players` | public |
| `GET /api/players/countries` | public |
| `GET /api/players/{id}` | public |
| `POST /api/players` | admin |
| `PUT /api/players` | admin |
| `DELETE /api/players/{id}` | admin |

```bash
# Rejected with 401
curl -X DELETE http://localhost:8080/api/players/1

# Accepted
curl -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" -X DELETE http://localhost:8080/api/players/1
```

Allowed browser origins are set with `ALLOWED_ORIGINS` (comma-separated).
Note that CORS restricts browsers only — it is not an access control, which is
why the write endpoints are authenticated rather than relying on it.

`POST` requires a client-supplied `id`: the `Player` entity uses an assigned
identifier rather than a generated one, because the table is populated from a
dataset with pre-existing ids.
