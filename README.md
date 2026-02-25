
<p align="center">
  <img src="front-end/public/favicon.png" width="100" alt="Whisprr logo"/>
</p>

<h1 align="center">💬 Whisprr</h1>

<p align="center">
  <strong>A real-time chat app built with the modern full-stack JavaScript ecosystem.</strong><br/>
  Clean UI. Secure backend. Live messaging. Image sharing. Online presence. Built to impress.
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"/>
  <img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-orange?style=for-the-badge"/>
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
</p>

---

## ✨ What is Whisprr?

**Whisprr** is a full-stack, real-time messaging web application that lets users sign up, find contacts, and chat instantly — with image sharing, online status indicators, notification sounds, profile pictures, and a polished animated UI.

> Think of it as a production-ready scaffold for a modern chat product — not just a demo.

---

## 🖼️ App Screenshots

<p align="center">
  <img src="front-end/public/login.png" alt="Login Page" width="47%" style="border-radius:8px; margin:4px"/>
  <img src="front-end/public/signup.png" alt="Signup Page" width="47%" style="border-radius:8px; margin:4px"/>
</p>
<p align="center">
  <img src="front-end/public/screenshot-for-readme.png" alt="Chat Interface" width="96%" style="border-radius:8px; margin:4px"/>
</p>

---

## 🚀 Features at a Glance

| Feature | Details |
|---|---|
| 🔐 **Secure Authentication** | JWT stored in httpOnly cookies. bcrypt password hashing. Session restored on page load. |
| 🛡️ **Enterprise-Grade Security** | Arcjet: SQL injection/XSS shield, bot detection, rate limiting (100 req/60s). |
| ⚡ **Real-Time Messaging** | Socket.io — messages delivered instantly to the recipient without page refresh. |
| 🟢 **Online Status Indicators** | Live green dot on each contact showing who is currently online. |
| 🔔 **Notification Sound** | Plays a notification sound when you receive a new message (toggleable). |
| 📸 **Profile Pictures** | Click your avatar to upload a new photo — stored on Cloudinary CDN. |
| 💬 **Text Messaging** | Send and receive messages with timestamps and per-sender alignment. |
| 🖼️ **Image Sharing** | Attach and send images in chat. Base64 → Cloudinary upload on the server. |
| ⚡ **Quick Messages** | "Say Hello 👋", "How are you? 🤝", "Meet up soon? 📅" — one-click icebreakers. |
| 🔊 **Keyboard Sounds** | Satisfying keystroke sound effects while typing (toggleable per session). |
| 📧 **Welcome Email** | Resend sends a branded HTML welcome email on every new signup. |
| ✉️ **Optimistic UI** | Messages appear instantly in the UI before the server confirms them. |
| 🎨 **Animated Border UI** | Rotating conic-gradient border wraps the whole chat interface. |

---

## 🏗️ Project Structure

```
Whisprr/
├── front-end/                  # React + Vite
│   ├── index.html              # Entry HTML — sets title, favicon
│   └── src/
│       ├── App.jsx             # Root router + auth session restore
│       ├── pages/
│       │   ├── ChatPage.jsx    # Main two-panel chat UI
│       │   ├── LoginPage.jsx   # Login form
│       │   └── SignUpPage.jsx  # Registration form
│       ├── components/
│       │   ├── ProfileHeader.jsx           # Avatar, username, sound, logout
│       │   ├── ChatContainer.jsx           # Message list + auto-scroll + socket listener
│       │   ├── ChatHeader.jsx              # Selected user info + online dot + Esc to close
│       │   ├── MessageInput.jsx            # Text + image compose bar
│       │   ├── ChatsList.jsx               # Conversations sidebar (online dots)
│       │   ├── ContactList.jsx             # All users sidebar (online dots)
│       │   ├── ActiveTabSwitch.jsx         # Chats | Contacts tab bar
│       │   ├── BorderAnimatedContainer.jsx # Conic-gradient animated border
│       │   ├── NoChatHistoryPlaceholder.jsx# Quick-send icebreakers
│       │   ├── NoConversationPlaceholder.jsx # "Select a conversation"
│       │   ├── PageLoader.jsx              # Full-screen spinner
│       │   ├── MessagesLoadingSkeleton.jsx # Chat message skeletons
│       │   └── UsersLoadingSkeleton.jsx    # Contact/chat list skeletons
│       ├── store/
│       │   ├── useAuthStore.js  # Zustand: auth state, socket connect/disconnect, onlineUsers
│       │   └── useChatStore.js  # Zustand: messages, contacts, sound, subscribeToMessages
│       ├── hooks/
│       │   └── useKeyboardSound.js  # Keystroke audio hook
│       └── lib/
│           └── axios.js             # Pre-configured Axios instance
│
└── back-end/                   # Node.js + Express
    └── src/
        ├── server.js            # App entry: middleware, routes, static serve
        ├── controllers/
        │   ├── auth.controller.js     # signup / login / logout / updateProfile
        │   └── message.controller.js  # contacts / chats / messages / sendMessage
        ├── middleware/
        │   ├── auth.middleware.js     # JWT cookie verification → req.user
        │   ├── arcjet.middleware.js   # Security + rate limiting
        │   └── socket.auth.middleware.js # Socket.io JWT authentication
        ├── models/
        │   ├── User.js                # username, email, password, profilePicture, bio
        │   └── message.js             # senderId, receiverId, text, image
        ├── routes/
        │   ├── auth.route.js          # /api/auth/*
        │   └── message.route.js       # /api/messages/*
        └── lib/
            ├── db.js          # Mongoose connection
            ├── utils.js       # generateToken (JWT + cookie)
            ├── socket.js      # Socket.io server + online user tracking
            ├── cloudinary.js  # Cloudinary SDK config
            ├── arcjet.js      # Arcjet security client
            ├── resend.js      # Resend email client
            └── env.js         # Centralised env variable access
```

---

## 🔄 How It All Connects

```
Browser (React + Vite)
       │
       ├── HTTP + JWT Cookie ──────────────────────────────────────────────────┐
       └── WebSocket (Socket.io) ─── authenticated via JWT cookie handshake    │
                                                                               ▼
                                                                  Express Server (Node.js)
                                                                         │
                                      ┌──────────────────────────────────┤
                                      │                                  │
                               Arcjet Middleware              Socket.io Server
                               (bot/rate limit)              (userSocketMap)
                                      │                                  │
                               Auth Middleware                getOnlineUsers → all clients
                               (JWT → req.user)               newMessage → target socket
                                      │
                          ┌───────────┴───────────────┐
                          │                           │
                  Auth Controller             Message Controller
                  ├─ signup                  ├─ getAllContacts
                  ├─ login                   ├─ getChatPartners
                  ├─ logout                  ├─ getMessagesByUserId
                  └─ updateProfile           └─ sendMessage
                       │                            │
                  Cloudinary (avatar)          Cloudinary (chat image)
                  Resend (email)               MongoDB (message record)
                  MongoDB (user)               Socket.io (real-time emit)
```

---

## 🔐 Security Model

- **JWT in httpOnly cookies** — Tokens are never accessible to JavaScript, mitigating XSS token theft.
- **`sameSite: strict`** — Cookies only sent in same-site requests, preventing CSRF.
- **`secure: true` in production** — Cookies only travel over HTTPS.
- **bcrypt hashing** — Passwords are never stored in plaintext.
- **Password excluded from responses** — `.select("-password")` always used; hash never reaches the client.
- **Socket.io JWT auth** — Every socket connection is authenticated via the same JWT cookie before it's accepted.
- **Arcjet Shield** — Blocks SQL injection, XSS, and path traversal in every request.
- **Bot detection** — Only legitimate human traffic and whitelisted crawlers are allowed.
- **Rate limiting** — Sliding window of 100 requests / 60 seconds per IP.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account → [cloudinary.com](https://cloudinary.com)
- Resend account → [resend.com](https://resend.com) *(optional — welcome emails)*
- Arcjet account → [arcjet.com](https://arcjet.com) *(optional — security middleware)*

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/whisprr.git
cd whisprr
```

### 2. Configure Backend Environment Variables

Create `back-end/.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/whisprr

# Auth
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend origin (for CORS + Socket.io)
CLIENT_URL=http://localhost:5173

# Cloudinary (profile pictures + chat images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend (welcome emails — optional)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=hello@yourdomain.com
EMAIL_FROM_NAME=Whisprr

# Arcjet (security — optional)
ARCJET_KEY=ajkey_your_key_here
ARCJET_ENV=development
```

### 3. Install & Run Backend

```bash
cd back-end
npm install
npm run dev
# ✅ Server running on http://localhost:3000
# ✅ Socket.io listening on the same port
```

### 4. Install & Run Frontend

```bash
cd front-end
npm install
npm run dev
# ✅ App running on http://localhost:5173
```

---

## 📡 API Reference

### Authentication  `base: /api/auth`

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| `POST` | `/signup` | ❌ | Register a new user + send welcome email |
| `POST` | `/login` | ❌ | Log in and receive JWT cookie |
| `POST` | `/logout` | ❌ | Clear the JWT cookie |
| `PUT` | `/update-profile` | ✅ | Upload new profile picture (base64 → Cloudinary) |
| `GET` | `/check` | ✅ | Restore session from cookie (called on app boot) |

### Messaging  `base: /api/messages`

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| `GET` | `/contacts` | ✅ | All registered users except self |
| `GET` | `/chats` | ✅ | Users you have exchanged messages with |
| `GET` | `/:id` | ✅ | Full message history with user `:id` |
| `POST` | `/send/:id` | ✅ | Send text and/or image to user `:id` |

---

## 🗄️ Data Models

### User

```js
{
  username:       String,   // required, unique — displayed in UI
  email:          String,   // required, unique — used for login
  password:       String,   // bcrypt hash — never returned in responses
  profilePicture: String,   // Cloudinary CDN URL (default: "")
  bio:            String,   // optional short bio (default: "")
  createdAt:      Date,
  updatedAt:      Date
}
```

### Message

```js
{
  senderId:   ObjectId,  // ref: User
  receiverId: ObjectId,  // ref: User
  text:       String,    // optional, max 2000 chars
  image:      String,    // optional, Cloudinary CDN URL
  createdAt:  Date,
  updatedAt:  Date
}
```

---

## 🌐 State Management

Whisprr uses [**Zustand**](https://github.com/pmndrs/zustand) for lightweight global state — no boilerplate, no context providers.

| Store | Key State |
|---|---|
| `useAuthStore` | `authUser`, `isCheckingAuth`, `isLoggingIn`, `isSigningUp`, `socket`, `onlineUsers` |
| `useChatStore` | `messages`, `allContacts`, `chats`, `selectedUser`, `activeTab`, `isSoundEnabled` |

---

## 🔮 Roadmap / Coming Soon

- [x] ~~Real-time messaging via Socket.io~~ ✅ Done
- [x] ~~Online/offline status indicators~~ ✅ Done
- [x] ~~Notification sounds on new messages~~ ✅ Done
- [ ] **Read receipts** — "Seen" indicator per message
- [ ] **Typing indicators** — "User is typing…" via socket events
- [ ] **Message deletion** — Soft-delete or retract messages
- [ ] **Group chats** — Many-to-many message schema
- [ ] **Push notifications** — Browser notifications for background messages
- [ ] **Message search** — Full-text search across conversation history
- [ ] **Mobile app** — React Native frontend sharing the same backend

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Zustand](https://zustand-demo.pmnd.rs) | Global state management |
| [TailwindCSS](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) | Styling & components |
| [Socket.io Client](https://socket.io) | Real-time bidirectional communication |
| [Axios](https://axios-http.com) | HTTP client |
| [React Router](https://reactrouter.com) | Client-side routing |
| [Lucide React](https://lucide.dev) | Icon library |
| [React Hot Toast](https://react-hot-toast.com) | Toast notifications |

### Backend
| Technology | Role |
|---|---|
| [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | HTTP server |
| [Socket.io](https://socket.io) | Real-time WebSocket server |
| [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com) | Database & ODM |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT signing/verification |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Cloudinary](https://cloudinary.com) | Image CDN & upload |
| [Resend](https://resend.com) | Transactional emails |
| [Arcjet](https://arcjet.com) | Security middleware |
| [cookie-parser](https://github.com/expressjs/cookie-parser) | JWT cookie parsing |
| [cors](https://github.com/expressjs/cors) | Cross-origin resource sharing |

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ and way too much caffeine.<br/>
  <strong>Whisprr — because great conversations start with a whisper. 💬</strong>
</p>
