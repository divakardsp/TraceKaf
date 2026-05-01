# TraceKaf - Real-Time Location Tracking Application

TraceKaf is a real-time location tracking application that allows users to share their live locations with friends and family on an interactive map. Built with Express.js, Socket.IO, Kafka, and TypeScript, it provides secure authentication via OAuth2 and seamless real-time updates.

## Prerequisites: Fortify OAuth2 Server

**TraceKaf requires [Fortify](https://github.com/divakardsp/Fortify) - an OIDC & OAuth2 Authorization Server - to be running.**

Before setting up TraceKaf, you must:

1. Clone and set up [Fortify](https://github.com/divakardsp/Fortify)
2. Register a client application in Fortify
3. Create a test user in Fortify
4. Get your OAuth credentials (Client ID, Client Secret, Fortify Public Key)

**Fortify runs on `http://localhost:5473` by default.**

---

## Features

- **Real-Time Location Tracking** - Live GPS location updates via Socket.IO
- **OAuth2 Authentication** - Secure login via Fortify
- **Interactive Maps** - Beautiful Leaflet-based map visualization
- **Kafka Streaming** - Scalable message queue for location updates
- **User Identity** - Show which user is at which location
- **Responsive UI** - Works on desktop, tablet, and mobile devices
- **Socket.IO Middleware** - Authenticated socket connections

---

## Tech Stack

| Component                   | Technology           |
| --------------------------- | -------------------- |
| **Runtime**                 | Node.js / Bun        |
| **Language**                | TypeScript           |
| **Backend Framework**       | Express.js 5.2       |
| **Real-Time Communication** | Socket.IO            |
| **Message Queue**           | Apache Kafka         |
| **Authentication**          | OAuth2 (via Fortify) |
| **JWT Verification**        | jsonwebtoken         |
| **Frontend**                | HTML5, Leaflet.js    |

---

## Prerequisites

Before you start, ensure you have:

- **Node.js** (v18+) or **Bun**
- **Docker** & **Docker Compose**
- **Apache Kafka** (via Docker)
- **Fortify OAuth2 Server** running on `http://localhost:5473`

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/divakardsp/TraceKaf.git
cd TraceKaf
```

### Step 2: Install Dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### Step 3: Set Up Fortify (OAuth2 Server)

Follow the [Fortify README](https://github.com/divakardsp/Fortify) to:

1. Clone Fortify
2. Generate RSA keys: `npm run keys`
3. Start PostgreSQL: `docker-compose up -d`
4. Run migrations: `npm run migrate`
5. Start Fortify: `npm run dev` (runs on `http://localhost:5473`)
6. Register an OAuth client and create a test user

### Step 4: Create `.env` File

Create a `.env` file in the root directory with the following variables:

```env
# Server Port
PORT=8000

# Fortify OAuth2 Configuration
CLIENT_ID=<your-fortify-client-id>
CLIENT_SECRET=<your-fortify-client-secret>
FORTIFY_JWK=[{"kty":"RSA","kid":"your-key-id","n":"your-n-value","e":"AQAB"}]

# Kafka Configuration (default Docker values)
KAFKA_BROKERS=kafka:9092
```

### Step 5: Start Docker Containers

Start Kafka and other services:

```bash
docker-compose up -d
```

This starts:

- Kafka broker on `localhost:9092`
- Zookeeper on `localhost:2181`

### Step 6: Start Development Server

Using npm:

```bash
npm run dev
```

Or using Bun:

```bash
bun run dev
```

Server will be running on `http://localhost:8000`

---

## Project Structure

```
TraceKaf/
├── src/
│   ├── app.ts                          # Express & Socket.IO setup
│   ├── index.ts                        # Server entry point
│   ├── common/
│   │   ├── middleware/
│   │   │   └── socketAuth.middleware.ts    # Socket.IO auth
│   │   └── utils/
│   │       ├── apiError.ts
│   │       ├── apiResponse.ts
│   │       ├── jwt.ts                     # JWT verification
│   │       ├── kafkaAdmin.ts
│   │       └── kafkaClient.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── location-tracker/
│   │   │   ├── location.controller.ts
│   │   │   ├── location.middleware.ts
│   │   │   ├── location.routes.ts
│   │   ├── socket/
│   │   │   └── onConnection.ts            # Socket event handlers
│   └── types/
│       └── socket.d.ts                 # Socket.IO type augmentation
├── public/
│   └── index.html                      # Live location tracking map
├── docker-compose.yml
├── tsconfig.json
├── package.json
└── README.md
```

---

## Authentication Flow

```
1. User visits http://localhost:8000/
   ↓
2. Server redirects to Fortify OAuth login
   ↓
3. User fills in credentials at Fortify
   ↓
4. Fortify returns authorization code
   ↓
5. TraceKaf exchanges code for ID token
   ↓
6. TraceKaf verifies token → Sets accessToken cookie
   ↓
7. Redirect to /live-location
   ↓
8. Socket.IO middleware verifies token from cookie
   ↓
9. User sees real-time location map with other active users
```

---

## How It Works

### Client-Side Flow (Browser)

1. User loads `/live-location` with valid `accessToken` cookie
2. Leaflet map initializes centered on user's location
3. Browser requests GPS permission
4. Every 5 seconds, user's location is sent to server via Socket.IO

### Server-Side Flow

1. Socket.IO middleware extracts `accessToken` from cookies
2. Token is verified and user info (`name`, `email`) is attached to socket
3. When client sends location update, it's published to Kafka topic `location-updates`
4. Kafka consumer reads the message
5. Server broadcasts to all connected clients via Socket.IO event `server:location-updates`
6. Clients update markers on their maps

### Map Display

- Your own marker (blue) shows your real-time location
- Other users' markers (colored) show their locations with names
- All updates happen in real-time without page refresh

---

## Socket.IO Events

### Client → Server

**Event:** `client:location-update`

```javascript
{
  latitude: number,
  longitude: number
}
```

Sent every 5 seconds with user's current GPS coordinates.

### Server → Client

**Event:** `server:location-updates`

```javascript
{
  id: string,           // User's socket ID
  name: string,         // User's name from token
  email: string,        // User's email from token
  latitude: number,
  longitude: number
}
```

Broadcast to all connected clients when any user updates location.

---

## Environment Variables Explained

| Variable        | Description                        | Example                  |
| --------------- | ---------------------------------- | ------------------------ |
| `PORT`          | Server port                        | `8000`                   |
| `CLIENT_ID`     | Fortify OAuth client ID            | UUID from Fortify        |
| `CLIENT_SECRET` | Fortify OAuth client secret        | Long string from Fortify |
| `FORTIFY_JWK`   | Fortify's public key in JWK format | Array of JWK objects     |
| `KAFKA_BROKERS` | Kafka broker addresses             | `kafka:9092`             |

### Getting Fortify Credentials

After setting up Fortify and registering a client:

1. **Get CLIENT_ID & CLIENT_SECRET** from Fortify's client registration response
2. **Get FORTIFY_JWK** from Fortify's JWKS endpoint:
    ```
    GET http://localhost:5473/.well-known/openid-configuration
    ```
    The response includes `jwks_uri`, fetch that to get the public key set.

---

## API Routes

### Authentication Routes (`/auth`)

| Method | Route                | Description                |
| ------ | -------------------- | -------------------------- |
| `GET`  | `/auth/fortify-auth` | Redirects to Fortify login |
| `GET`  | `/auth/callback`     | Fortify OAuth callback     |

### Location Routes (`/live-location`)

| Method | Route            | Description                     |
| ------ | ---------------- | ------------------------------- |
| `GET`  | `/live-location` | Serves map page (requires auth) |

### General Routes

| Method | Route | Description                      |
| ------ | ----- | -------------------------------- |
| `GET`  | `/`   | Redirects to Fortify OAuth login |

---

## Scripts

```bash
npm run dev        # Development with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Run compiled application
```

---
