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

| Method | Path                  | Description             | Auth Required |
| ------ | --------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register`  | Register a new user     | No            |
| POST   | `/api/auth/login`     | Login and receive a JWT | No            |

### Artists

| Method | Path                | Description                                  | Auth Required        |
| ------ | ------------------- | -------------------------------------------- | -------------------- |
| GET    | `/api/artist`       | List all artists (pagination & filtering)    | Yes (any user)       |
| GET    | `/api/artist/:id`   | Get a single artist by ID                    | Yes (any user)       |
| POST   | `/api/artist`       | Create a new artist                          | Yes (owner or admin) |
| PUT    | `/api/artist/:id`   | Update an existing artist                    | Yes (owner or admin) |
| DELETE | `/api/artist/:id`   | Delete an artist                             | Yes (owner or admin) |

### Songs

| Method | Path             | Description                             | Auth Required  |
| ------ | ---------------- | --------------------------------------- | -------------- |
| GET    | `/api/song`      | List all songs (sorted by title)        | Yes (any user) |
| GET    | `/api/song/:id`  | Get a single song by ID                 | Yes (any user) |
| POST   | `/api/song`      | Create a new song                       | Yes (owner)    |
| PUT    | `/api/song/:id`  | Update an existing song                 | Yes (owner)    |
| DELETE | `/api/song/:id`  | Delete a song                           | Yes (owner)    |

### Playlists

| Method | Path                  | Description                                   | Auth Required        |
| ------ | --------------------- | --------------------------------------------- | -------------------- |
| GET    | `/api/playlist`       | List all playlists (pagination & filtering)   | Yes (any user)       |
| GET    | `/api/playlist/:id`   | Get a single playlist by ID                   | Yes (any user)       |
| POST   | `/api/playlist`       | Create a new playlist                         | Yes (owner)          |
| PUT    | `/api/playlist/:id`   | Update an existing playlist                   | Yes (owner)          |
| DELETE | `/api/playlist/:id`   | Delete a playlist                             | Yes (owner)          |

---

## Dependencies & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v16+  
- [MongoDB](https://www.mongodb.com/) (local or Atlas)  

### Install

```bash
git clone https://github.com/yourusername/music-house-api.git
cd music-house-api
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```env
PORT=5173
MONGODB_URI=mongodb://localhost:27017/music_house
JWT_SECRET=your_jwt_secret_here
```

### Run

```bash
npm run start       # production mode
npm run dev         # development mode (uses nodemon)
```

---

## Architecture

```
/
├── controllers/      # Request handlers
│   ├── authController.js
│   ├── artistController.js
│   ├── songController.js
│   └── playlistController.js
│
├── models/           # Mongoose schemas
│   ├── User.js
│   ├── Artist.js
│   ├── Song.js
│   └── Playlist.js
│
├── routes/           # Express route definitions
│   ├── auth.js
│   ├── artists.js
│   ├── songs.js
│   └── playlists.js
│
├── middleware/       # Custom middleware (auth, error handling, validation)
│   ├── authMiddleware.js
│   └── validateRequest.js
│
├── config/           # App configuration (e.g. database connection)
│   └── db.js
│
├── server.js         # App entrypoint
└── package.json
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
   https://github.com/yourusername/music-house-api/issues  
2. Provide:  
   - A clear title and description  
   - Steps to reproduce the problem  
   - Expected vs actual behavior  
   - Any relevant error messages or stack traces  
3. Tag the issue appropriately (`bug`, `enhancement`, etc.)

We’ll review and respond as quickly as possible!

---

> _This README was generated as part of the IFN666 Assignment 2 server component._

