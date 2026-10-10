#!/usr/bin/env bash
#
# Loads the Kaggle "NBA Players" dataset (all_seasons.csv) into a LOCAL
# PostgreSQL database, so the app has data to show.
#
#   Usage:  backend/scripts/load-dataset.sh <path/to/all_seasons.csv> [--replace]
#
#   Env:    DB_NAME  database to load into (default: nba). Created if missing.
#
# Why this script exists: the player data is not in the repository, and the
# table must be filled with the dataset's own row numbers as ids (the Player
# entity uses assigned ids, not generated ones).
#
# Safety:
#   - Connects only to a database on this machine (local socket). It never reads
#     DB_URL from .env, clears PGHOST/PGSERVICE and similar variables that would
#     redirect psql, and rejects a DB_NAME that is a connection string. A
#     shared or production database cannot be wiped by running this.
#   - Refuses to touch a table that already has rows unless --replace is given.
#   - Loads in one explicit transaction: a failure part-way leaves the table
#     exactly as it was, including with --replace.
#   - Checks the CSV header before loading, so a different file fails loudly
#     instead of loading columns into the wrong fields.

set -euo pipefail

CSV="${1:-}"
MODE="${2:-}"
DB_NAME="${DB_NAME:-nba}"

die() { echo "error: $*" >&2; exit 1; }

# DB_NAME must be a plain database name. psql's -d also accepts a full
# connection string or URI, so an unchecked value like
# "postgresql://prod-host/nba" would point this script at a remote server.
[[ "$DB_NAME" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] \
  || die "DB_NAME must be a plain database name (letters, digits, underscores), got: $DB_NAME"

# psql and createdb honour these variables. Any of them could silently redirect
# every connection to another server, so clear them: this script only ever
# talks to PostgreSQL on this machine, over its local socket. (PGPORT is kept:
# it selects which local server, e.g. one on 5433.)
unset PGHOST PGHOSTADDR PGSERVICE PGSERVICEFILE PGDATABASE

[ -n "$CSV" ] || die "usage: $0 <path/to/all_seasons.csv> [--replace]"
[ -f "$CSV" ] || die "file not found: $CSV"
[ -z "$MODE" ] || [ "$MODE" = "--replace" ] || die "unknown option: $MODE (only --replace is supported)"
command -v psql >/dev/null || die "psql not found. Install PostgreSQL (brew install postgresql@14) and make sure it is on your PATH."

# The dataset's header. Its first column is the unnamed row number, which
# becomes the player row's id.
EXPECTED_HEADER=',player_name,team_abbreviation,age,player_height,player_weight,college,country,draft_year,draft_round,draft_number,gp,pts,reb,ast,net_rating,oreb_pct,dreb_pct,usg_pct,ts_pct,ast_pct,season'
ACTUAL_HEADER="$(head -1 "$CSV" | tr -d '\r\357\273\277')"   # strip CRLF and a UTF-8 BOM
if [ "$ACTUAL_HEADER" != "$EXPECTED_HEADER" ]; then
  echo "error: $CSV does not look like the Kaggle all_seasons.csv." >&2
  echo "  expected header: $EXPECTED_HEADER" >&2
  echo "  actual header:   $ACTUAL_HEADER" >&2
  exit 1
fi

# Local connection only: no host given, so psql uses this machine's socket.
pg() { psql -X -v ON_ERROR_STOP=1 -q "$@"; }

pg -d postgres -Atc "select 1" >/dev/null 2>&1 \
  || die "cannot reach PostgreSQL on this machine. Start it first: brew services start postgresql@14"

if ! pg -d postgres -Atc "select 1 from pg_database where datname = '$DB_NAME'" | grep -q 1; then
  echo "Creating database '$DB_NAME'..."
  createdb "$DB_NAME"
fi

# Same shape Hibernate generates for the Player entity on PostgreSQL, so the
# backend's ddl-auto=update accepts it without altering anything.
pg -d "$DB_NAME" <<'SQL'
CREATE TABLE IF NOT EXISTS player_stats (
    id                bigint PRIMARY KEY,
    player_name       varchar(255),
    team_abbreviation varchar(255),
    age               real,
    player_height     real,
    player_weight     real,
    college           varchar(255),
    country           varchar(255),
    draft_year        varchar(255),
    draft_round       varchar(255),
    draft_number      varchar(255),
    gp                integer,
    pts               real,
    reb               real,
    ast               real,
    net_rating        real,
    oreb_pct          real,
    dreb_pct          real,
    usg_pct           real,
    ts_pct            real,
    ast_pct           real,
    season            varchar(255)
);
SQL

EXISTING="$(pg -d "$DB_NAME" -Atc "select count(*) from player_stats")"
if [ "$EXISTING" != "0" ] && [ "$MODE" != "--replace" ]; then
  die "player_stats in '$DB_NAME' already has $EXISTING rows. Re-run with --replace to reload it (this deletes those rows first)."
fi

echo "Loading $CSV into $DB_NAME.player_stats..."
# Why FROM pstdin: the CSV is fed on psql's standard input, so its path never
# appears inside SQL and needs no quoting (a path containing an apostrophe
# broke the earlier quoted-path version).
# Why -1 with -c: psql documents that -1 wraps all -c commands in one
# transaction and, with ON_ERROR_STOP, sends ROLLBACK if any fails. A failed
# load therefore undoes the TRUNCATE and leaves existing rows intact.
pg -1 -d "$DB_NAME" \
  -c "TRUNCATE player_stats" \
  -c "\\copy player_stats (id, player_name, team_abbreviation, age, player_height, player_weight, college, country, draft_year, draft_round, draft_number, gp, pts, reb, ast, net_rating, oreb_pct, dreb_pct, usg_pct, ts_pct, ast_pct, season) FROM pstdin WITH (FORMAT csv, HEADER true)" \
  < "$CSV"

ROWS="$(pg -d "$DB_NAME" -Atc "select count(*) from player_stats")"
PLAYERS="$(pg -d "$DB_NAME" -Atc "select count(distinct player_name) from player_stats")"
SEASONS="$(pg -d "$DB_NAME" -Atc "select min(season) || ' to ' || max(season) from player_stats")"
echo "Done: $ROWS rows, $PLAYERS distinct players, seasons $SEASONS."
