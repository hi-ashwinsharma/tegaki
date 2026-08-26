<div align="center">

# Tegaki

### *First for yourself. Then, for the world.*

An enterprise-grade, tactile journaling and publication platform inspired by the quiet aesthetic of Medium.com.<br>
Engineered with **zero gradients**, **zero shadows**, client-side **AES-256-GCM** encryption, real-time Cloud Firestore synchronization, and custom author slug routing.

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3+-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.18+-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[Live Architecture Overview](docs/ARCHITECTURE.md) • [Security Model](docs/SECURITY.md) • [Report Issue](https://github.com/hi-ashwinsharma/tegaki/issues)

---

</div>

## 📖 Overview

**Tegaki** is designed as a sanctuary for unhurried thought. It removes the noisy algorithms, follower anxiety, and premature audience pressure common in modern publishing platforms, while maintaining an elegant bridge to deliberate public release when ideas are ready.

```
                  ┌──────────────────────────────────────────────┐
                  │                   TEGAKI                     │
                  │   "First for yourself. Then, for the world." │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
    ┌──────────────────────────┐                   ┌──────────────────────────┐
    │  The Solitary Notebook   │                   │   The Published Letter   │
    │  • In-memory AES-256 GCM │                   │  • Custom /@you/slug     │
    │  • Zero tracking & ads   │                   │  • Distraction-free read │
    │  • No audience metrics   │                   │  • Flame resonance claps │
    └──────────────────────────┘                   └──────────────────────────┘
```

---

## 🌟 Key Features

### 🖋️ Distraction-Free Writer Canvas
- **Floating Selection Toolbar**: Appears contextually when text is highlighted (**Bold**, *Italic*, 🔗 Link, **H1** Title, **H2** Subtitle, and ❝ Editorial Quote).
- **Empty Line Insertion (`+`) Menu**: Inline insertion for images (with caption), external website preview cards, code blocks, and hairline dividers.
- **Quiet Status Feedback**: Subtle indicators (*"Preserved in silence"*) replace disruptive banners.

### 🔒 Client-Side Cryptography (Private Sphere)
- **Zero-Knowledge Privacy**: Private notes are encrypted client-side using **AES-256-GCM** via the browser's native Web Crypto API before syncing.
- **Hardware-Level CSPRNG**: Cryptographically secure salts and 100,000 PBKDF2 iterations for key derivation.

### 🌐 Custom Author Slugs & Publishing
- Full author ownership of publication routes: `/@username/[your-custom-slug]` or `/story/[id]`.
- Direct URL resolution with graceful loading skeletons (*"The page is unfolding..."*) and missing-article fallbacks.

### ⚡ Real-Time Cloud Firestore Sync
- Multi-client reactive sync using Firestore `onSnapshot` listeners.
- **Cross-User Updates**: Publications, responses, and **Flame (🔥)** claps sync instantaneously without requiring manual page reloads.
- **Compound Query Indexing**: Deployed composite index on `collection('articles')` (`visibility ASC, createdAt DESC`).

### 🎨 4 Calibrated Reading Themes with View Transitions
- **Pure White**: High-contrast, pristine paper.
- **Paper Ivory (`#FBF9F5`)**: Eye-comfort warm parchment.
- **Medium Dark (`#242424`)**: Refined editorial slate.
- **AMOLED Black (`#000000`)**: True zero-pixel OLED black.
- **Circle-Out Radial Reveal**: Smooth, fluid theme transition powered by the browser View Transitions API.

### 📊 Dynamic Two-Way Feed Ranking
- **`Latest`** (`Clock`): Chronological order by publication date.
- **`Most Resonated`** (`Flame`): Ranked by total reader claps and community resonance.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **UI Framework** | [React 19.2](https://react.dev/) | Concurrent rendering, Hooks architecture |
| **Build Engine** | [Vite 8.2](https://vitejs.dev/) | Ultra-fast HMR and optimized production bundle |
| **Language** | [TypeScript 7.0](https://www.typescriptlang.org/) | Strict end-to-end type safety |
| **Design System** | [Tailwind CSS 4.3](https://tailwindcss.com/) | Strict minimalist theme engine (zero shadows / zero gradients) |
| **Cloud Database** | [Google Cloud Firestore](https://firebase.google.com/) | Real-time NoSQL document store with composite indexing |
| **Authentication** | [Firebase Auth 12.18](https://firebase.google.com/) | Google OAuth, WebAuthn Passkeys, Email/Password |
| **Typography** | Newsreader & System Serif | Golden-ratio editorial reading experience |
| **Icons** | [Lucide React 1.34](https://lucide.dev/) | Pure monochrome vector iconography |

---

## 🚀 Quick Start

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hi-ashwinsharma/tegaki.git
cd tegaki

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```ini
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🛡️ Security & Access Control

Tegaki enforces hardened, production-grade security rules across Cloud Firestore:
- **Ownership Verification**: Deletions and edits require `request.auth.uid == resource.data.authorId`.
- **Private Data Protection**: Queries for private notes are strictly denied on the server unless called by the document owner.
- **Anti-DoS Validation**: Payload size caps (1MB for story bodies, 500 chars for titles).
- **Tamper-Proof Claps**: Public applause requests are diff-checked to ensure only atomic `+1` increments are accepted.

For full details, review [docs/SECURITY.md](docs/SECURITY.md).

---

## 📚 Documentation Index

- **[System Architecture](docs/ARCHITECTURE.md)**: Deep dive into data flow, encryption pipeline, and directory layout.
- **[Security Model](docs/SECURITY.md)**: Threat matrix, Web Crypto API specifications, and Firestore security rules.

---

## 👨‍💻 Creator & Attribution

Crafted with care by **[Ashwin Sharma](https://hi-ashwin.xyz)**.

- **Website**: [https://hi-ashwin.xyz](https://hi-ashwin.xyz)
- **Email**: [ashwin@tegaki.io](mailto:ashwin@tegaki.io)
- **Repository Remote**: [https://github.com/hi-ashwinsharma/tegaki](https://github.com/hi-ashwinsharma/tegaki)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
