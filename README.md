# API Endpoints

Below is a list of all available endpoints in the Music Streaming Service REST API.

## Authentication

| Method | Path                 | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user     | No            |
| POST   | `/api/auth/login`    | Login and receive a JWT | No            |

## Artists

| Method | Path              | Description                                    | Auth Required        |
| ------ | ----------------- | ---------------------------------------------- | -------------------- | --- |
| GET    | `/api/artist`     | List all artists (with pagination & filtering) | Yes                  |     |
| GET    | `/api/artist/:id` | Get a single artist by ID                      | Yes                  |     |
| POST   | `/api/artist`     | Create a new artist                            | Yes                  |
| PUT    | `/api/artist/:id` | Update an existing artist                      | Yes (owner or admin) |
| DELETE | `/api/artist/:id` | Delete an artist                               | Yes (owner or admin) |

## Songs

| Method | Path            | Description                      | Auth Required |
| ------ | --------------- | -------------------------------- | ------------- | --- |
| GET    | `/api/song`     | List all songs (sorted by title) | Yes           |
| GET    | `/api/song/:id` | Get a single song by ID          | Yes           |     |
| POST   | `/api/song`     | Create a new song                | Yes           |
| PUT    | `/api/song/:id` | Update an existing song          | Yes           |
| DELETE | `/api/song/:id` | Delete a song                    | Yes           |

## Playlists

| Method | Path                | Description                                      | Auth Required        |
| ------ | ------------------- | ------------------------------------------------ | -------------------- | --- |
| GET    | `/api/playlist`     | List all playlists (with pagination & filtering) | Yes                  |
| GET    | `/api/playlist/:id` | Get a single playlist by ID                      | Yes                  |     |
| POST   | `/api/playlist`     | Create a new playlist                            | Yes                  |
| PUT    | `/api/playlist/:id` | Update an existing playlist                      | Yes (owner or admin) |
| DELETE | `/api/playlist/:id` | Delete a playlist                                | Yes (owner or admin) |
