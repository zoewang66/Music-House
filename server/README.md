# Music House API

## Purpose

Music House is a simple RESTful API for managing a music library. It supports user authentication (register / login), and CRUD operations on three main resources:

- **Artists**
- **Songs**
- **Playlists**

Users must be authenticated (via JSON Web Tokens) to create, update or delete resources.

---

## Features

- User registration & login (JWT-based authentication)
- Create, read, update, delete (CRUD) for Artists, Songs and Playlists
- Protected routes—only logged-in users can modify data
- Input validation with `express-validator`
- Modular MVC-style architecture

---

## API Endpoints

### Authentication

| Method | Path                 | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user     | No            |
| POST   | `/api/auth/login`    | Login and receive a JWT | No            |

### Artists

| Method | Path              | Description                               | Auth Required        |
| ------ | ----------------- | ----------------------------------------- | -------------------- |
| GET    | `/api/artist`     | List all artists (pagination & filtering) | Yes (any user)       |
| GET    | `/api/artist/:id` | Get a single artist by ID                 | Yes (any user)       |
| POST   | `/api/artist`     | Create a new artist                       | Yes (owner or admin) |
| PUT    | `/api/artist/:id` | Update an existing artist                 | Yes (owner or admin) |
| DELETE | `/api/artist/:id` | Delete an artist                          | Yes (owner or admin) |

### Songs

| Method | Path            | Description                      | Auth Required  |
| ------ | --------------- | -------------------------------- | -------------- |
| GET    | `/api/song`     | List all songs (sorted by title) | Yes (any user) |
| GET    | `/api/song/:id` | Get a single song by ID          | Yes (any user) |
| POST   | `/api/song`     | Create a new song                | Yes (owner)    |
| PUT    | `/api/song/:id` | Update an existing song          | Yes (owner)    |
| DELETE | `/api/song/:id` | Delete a song                    | Yes (owner)    |

### Playlists

| Method | Path                | Description                                 | Auth Required  |
| ------ | ------------------- | ------------------------------------------- | -------------- |
| GET    | `/api/playlist`     | List all playlists (pagination & filtering) | Yes (any user) |
| GET    | `/api/playlist/:id` | Get a single playlist by ID                 | Yes (any user) |
| POST   | `/api/playlist`     | Create a new playlist                       | Yes (owner)    |
| PUT    | `/api/playlist/:id` | Update an existing playlist                 | Yes (owner)    |
| DELETE | `/api/playlist/:id` | Delete a playlist                           | Yes (owner)    |

---

## Dependencies & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [Express](https://expressjs.com/) v4+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Install

```bash
git clone https://github.com/yourusername/music-house.git
cd music-house
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```env
PORT=5010
MONGODB_URI=mongodb://localhost:27017/musicdb
JWT_SECRET=52a3d63bef9ee922cd7dc6395a6f3a93bf617ded2f378dab1bf6b9631625d69be6cb4d2d8bcf8ce698b1428ffa795a8a47232f6cdbebfce0568791953b8120c7
```

### Run

```bash
cd script
node data.js
cd ..
node server.js
```

---

## Architecture

```
server/
├── script/                      # utility scripts
│   ├── data.js
├── src/
│   ├── controllers/             # controllers for each resource
│   │   ├── auth.js
│   │   ├── artists.js
│   │   ├── songs.js
│   │   └── playlists.js
│   │
│   ├── middleware/              # auth, validation, etc.
│   │   ├── authenticateWithJwt.js
│   │   ├── validateMongoId.js
│   │   └── validatePaginateQueryParams.js
│   │
│   ├── models/                  # Mongoose schemas
│   │   ├── user.js
│   │   ├── artist.js
│   │   ├── song.js
│   │   └── playlist.js
│   │
│   ├── routes/                  # Express route definitions
│   │   ├── auth.js
│   │   ├── artist.js
│   │   ├── song.js
│   │   ├── playlist.js
│   │   └── index.js
│   │
│   └── utils/                   # helper functions
│       └── generatePaginationLinks.js
│
├── .env
├── API-collection.json
├── package.json
├── package-lock.json
└── server.js                    # app entrypoint

```

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Install** dependencies and make your changes
4. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add search by artist name"
   ```
5. **Push** to your fork and open a **Pull Request** against `main`
6. **Review** and address any feedback, then your PR will be merged!

Please follow the existing coding style and run `npm test` (if you add tests) before submitting.

---

## Reporting Issues

If you encounter a bug or have a feature request, please:

1. Open a new issue on GitHub:  
   https://github.com/yourusername/music-house/issues
2. Provide:
   - A clear title and description
   - Steps to reproduce the problem
   - Expected vs actual behavior
   - Any relevant error messages or stack traces
3. Tag the issue appropriately (`bug`, `enhancement`, etc.)

We’ll review and respond as quickly as possible!
