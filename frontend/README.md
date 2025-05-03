# Music House Client

## Purpose

Music House Client is a React application that lets users log in, then browse, create, edit, and delete Artists, Songs, and Playlists through the Music House API. It provides a clean, responsive UI built with Mantine and handles authentication, protected routes, in-UI confirmations, and notifications.

---

## Contributing

If you’d like to help improve the Music House Client:

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/yourusername/music-house-client.git
   cd music-house-client
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install** dependencies and develop:
   ```bash
   npm install
   npm run dev
   ```
5. **Commit** your changes with a clear message:
   ```bash
   git commit -m "feat: add dark-mode toggle"
   ```
6. **Push** to your fork and open a **Pull Request** against main.
7. Address any review feedback; once approved, your changes will be merged.

Please follow the existing code style, include tests for new functionality, and update this README if you add or change features.

---

## Dependencies & Installation

### Prerequisites

- **Node.js** v16 or higher
- **npm** (comes with Node.js) or **yarn**

### Project Dependencies

The client application uses the following main packages:

- `react` & `react-dom` — core React libraries
- `react-router-dom` — client-side routing
- `@mantine/core` & `@mantine/hooks` — UI component library & hooks
- `@mantine/notifications` — toast notifications
- `@tanstack/react-query` — data-fetching and caching
- `axios` — HTTP client for talking to the API
- `vite` — development server & build tool

### Install & Run

1. **Clone** the repo and `cd` into it:
   ```bash
   git clone https://github.com/yourusername/music-house.git
   cd music-house
   ```
2. **Install** all dependencies in one command:
   ```bash
   # with npm
   npm create vite@latest
   # or with yarn
   yarn create vite
   ```
3. **Start** the development server:
   ```bash
   npm install
   npm run dev
   ```

--

## Architecture
frontend/
├── public/                         # static assets
│   └── vite.svg
├── src/
│   ├── api/                        # wrapper for fetch/axios API calls
│   │   └── index.js
│   │
│   ├── components/                 # reusable UI components
│   │   ├── Artists/
│   │   │   ├── ArtistCard.jsx
│   │   │   ├── ArtistForm.jsx
│   │   │   └── ArtistList.jsx
│   │   ├── Playlists/
│   │   │   ├── PlaylistCard.jsx
│   │   │   └── PlaylistsList.jsx
│   │   ├── Songs/
│   │   │   ├── SongCard.jsx
│   │   │   ├── SongForm.jsx
│   │   │   └── SongsList.jsx
│   │   ├── PrivateRoute.jsx       # protects routes for authenticated users
│   │   └── PageContainer.jsx      # common page layout wrapper
│   │
│   ├── contexts/                  # React Contexts
│   │   └── AuthContext.jsx        # manages JWT, login/logout, attaches auth header
│   │
│   ├── css/                       # custom styles
│   │   ├── Card.css
│   │   ├── Home.css
│   │   └── Page.css
│   │
│   ├── images/                    # static images used in pages
│   │   ├── picture1.png
│   │   ├── picture2.png
│   │   └── picture3.png
│   │
│   ├── pages/                     # route-level page components
│   │   ├── Artists.jsx
│   │   ├── Home.jsx
│   │   ├── Layout.jsx             # global header/navigation + outlet
│   │   ├── Login.jsx
│   │   ├── NoPage.jsx             # 404 fallback
│   │   ├── Playlists.jsx
│   │   ├── Register.jsx
│   │   └── Songs.jsx
│   │
│   ├── App.jsx                    # React Router setup
│   ├── main.jsx                   # application entrypoint, wraps App in AuthProvider
│   └── index.css                  # global CSS
│
├── .env                            # environment variables (VITE_API_URL)
├── .gitignore
├── package.json                    # scripts & dependencies
└── vite.config.js                  # Vite configuration
--

## How to Report Issues

If you encounter a bug or have a feature request, please follow these steps:

1. **Visit the repository’s issue tracker**  
   Go to:  
   `https://github.com/yourusername/music-house/issues`

2. **Click “New issue”**

3. **Fill out the issue template**

   - **Title:** A concise summary of the problem or request
   - **Description:** Detailed explanation of the issue or feature
   - **Steps to reproduce (for bugs):**
     1. Step one
     2. Step two
     3. ...
   - **Expected vs. actual behavior:** What you expected to happen and what actually happened
   - **Environment details (if relevant):**
     - Browser and version (e.g., Chrome 114, Firefox 112)
     - Operating system (e.g., Windows 10, macOS Monterey)
     - Node.js and npm/yarn versions

4. **Label the issue** (if you have permissions)

   - `bug` for errors or unintended behavior
   - `enhancement` for feature requests
   - `question` for usage or clarification

5. **Submit the issue** and wait for a response
   - We aim to acknowledge all issues within 48 hours
   - We may ask for additional information or logs to help diagnose the problem
