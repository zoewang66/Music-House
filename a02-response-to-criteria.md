# IFN666_25se1 Assessment 02 Submission

**Student name:**  Peiying Wang

**Student ID:** n11449314

# Response to marking criteria

## (API) Core: Application architecture (1 mark)

- **One line description:** 
I used a layered architecture of models, routes, controllers, middleware
- **Video timestamp:** 
0:20
- **Relevant files**
   - /server/src/models
   - /server/src/routes
   - /server/src/controllers
   - /server/src/middleware

## (API) Core: Endpoints (2 marks)

- **One line description:** 
Implemented RESTful Express routes for CRUD operations on artists, authentication, playlists, and combined them in the main router.
- **Video timestamp:** 
03:43
- **Relevant files**
   - server/src/routes/artist.js
   - server/src/routes/auth.js
   - server/src/routes/index.js
   - server/src/routes/playlist.js

## (API) Core: Data model (3 marks)

- **One line description:** 
Defined Mongoose schemas for Artist, Playlist, Song, and User with appropriate fields, relationships, and validation rules
- **Video timestamp:** 
02:55
- **Relevant files**
   - server/src/models/artist.js
   - server/src/models/playlist.js
   - server/src/models/song.js
   - server/src/models/user.js

## (API) Core: Data interface (3 marks)

- **One line description:** 
Created controller functions to handle incoming requests, perform business logic, and interact with the database for each resource
- **Video timestamp:** 
02:05
- **Relevant files**
   - /server/src/controllers/artists.js
   - /server/src/controllers/auth.js
   - /server/src/controllers/playlists.js
   - /server/src/controllers/songs.js

## (API) Core: Deployment to web server (3 marks)

- **One line description:** 
Configured a Caddy file to reverse-proxy API requests to the Node server and serve the frontend static build
- **Video timestamp:** 
06:11
- **Relevant files**
   - /Caddyfile

## (API) Core: API testing with Hoppscotch (3 marks)

- **One line description:** 
Provided a Hoppscotch collection to demonstrate and verify all API endpoints with sample requests and responses
- **Video timestamp:** 
05:18
- **Relevant files**
   - /API-collection.json

## (API) Additional: Authentication (3 marks)

- **One line description:**
Implemented JWT-based authentication with login/register controllers and middleware to protect secured routes
- **Video timestamp:** 
01:37
- **Relevant files**
   - server/src/controllers/auth.js
   - server/src/middleware/authenticateWithJwt.js

## (API) Additional: Input validation (3 marks)

- **One line description:** 
Added server-side validation in controllers to enforce required fields and correct data types before processing
- **Video timestamp:** 
01:45
- **Relevant files**
   - /server/src/controllers/artists.js
   - /server/src/controllers/auth.js
   - /server/src/controllers/playlists.js
   - /server/src/controllers/songs.js


## (API) Additional: Rate limiting (3 marks)

- **One line description:** 
Integrated express-rate-limit middleware in server.js to throttle incoming requests and prevent abuse
- **Video timestamp:** 
07:07
- **Relevant files**
   - server/server.js


## (API) Additional: Pagination (3 marks)

- **One line description:** 
Built middleware to parse and validate pagination query parameters and generate pagination links for list endpoints
- **Video timestamp:** 
08:52
- **Relevant files**
   - server/src/middleware/validatePaginateQueryParams.js
   - server/src/utils/generatePaginationLinks.js


## (API) Additional: Custom middleware (3 marks)

- **One line description:** 
Developed custom middleware for JWT authentication, MongoDB ObjectID validation, and pagination parameter checks
- **Video timestamp:** 
02:49
- **Relevant files**
   - server/src/middleware/authenticateWithJwt.js
   - server/src/middleware/validatePaginateQueryParams.js
   - server/src/middleware/validateMongold.js



---


## (Client) Core: Application architecture (3 marks)

- **One line description:** 
09:42
- **Video timestamp:** 
Organized a React app with clear separation of components, pages, contexts, and API utility modules under client/src
- **Relevant files**
   - client/src/components
   - client/src/contexts
   - client/src/pages
   - client/src/api
   - client/App.jsx
   - client/main.jsx
   - client/package.json
   - client/public

## (Client) Core: User interface design (3 marks)

- **One line description:** 
Designed UI using Mantine components and custom CSS to deliver a cohesive, accessible layout across all pages.
- **Video timestamp:** 
06:17
- **Relevant files**
   - client/src/components
   - client/src/pages
   - client/src/css
   - client/src/index.css

## (Client) Core: React components (3 marks)

- **One line description:** 
Built reusable Mantine-based components for lists, forms, and navigation used in Songs, Artists, and Playlists pages
- **Video timestamp:** 
10:02
- **Relevant files**
   - client/src/components
   - client/src/pages

## (Client) Core: State management (3 marks)

- **One line description:** 
Leveraged React Query and Context API to manage authentication state and cache API data for songs, artists, and playlists
- **Video timestamp:** 
10:14
- **Relevant files**
   - client/src/components/Artists
   - client/src/components/Playlists
   - client/src/components/Songs

## (Client) Core: API integration (3 marks)

- **One line description:** 
Consumed backend API through a centralized client/src/api module and hooks within components for all CRUD operations
- **Video timestamp:** 
08:31
- **Relevant files**
   - client/src/components
   - client/src/contexts
   - client/src/pages
   - client/src/api

## (Client) Additional: Authentication (3 marks)

- **One line description:** 
Implemented login and registration pages that store JWT in context and persist auth state across sessions
- **Video timestamp:** 
06:45
- **Relevant files**
   - client/src/pages/Login.jsx
   - client/src/pages/Register.jsx

## (Client) Additional: Input validation (3 marks)

- **One line description:** 
Used Mantine form validation for all input fields in song, artist, and playlist forms to ensure correctness before submit
- **Video timestamp:** 
07:19
- **Relevant files**
   - client/src/components/Artists
   - client/src/components/Playlists
   - client/src/components/Songs

## (Client) Additional: Rate limiting (3 marks)

- **One line description:** 
Applied client-side debouncing on search inputs and disabled rapid successive form submissions to respect API rate limits
- **Video timestamp:** 
08:52
- **Relevant files**
   - client/src/components/Artists
   - client/src/components/Playlists
   - client/src/components/Songs


## (Client) Additional: Pagination (3 marks)

- **One line description:** 
Rendered pagination controls and fetched specific data pages using React Query based on API pagination metadata
- **Video timestamp:** 
08:52
- **Relevant files**
   - client/src/components/Artists
   - client/src/components/Playlists
   - client/src/components/Songs


## (Client) Additional: Responsive design (3 marks)

- **One line description:** 
Employed Mantine’s responsive props and CSS flex/grid to adapt layouts for different screen sizes seamlessly
- **Video timestamp:** 
08:21
- **Relevant files*s
   - client/src/css

