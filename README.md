# Tegaki (手書き)

> A minimalist journaling & publication platform replicating the tactile, distraction-free aesthetic of Medium.com writer with **zero gradients**, **zero shadows**, 4 calibrated reading themes, client-side AES-GCM 256-bit encryption for private journals, and custom author slug routing (`/@username/slug`).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0+-3178C6.svg)
![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-8.2+-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3+-38BDF8.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.18+-FFCA28.svg)

---

## ✨ Features

- **Strict Minimalist Aesthetic (4 Themes)**:
  - `Pure White`: Crisp, high-contrast clarity.
  - `Paper Ivory (Off-White)`: Warm eye-comfort paper tone.
  - `Medium Dark`: Android/Web dark app tone (`#242424`).
  - `AMOLED Black`: Deep OLED black minimalism (`#000000`).
  - **Strictly 0 gradients and 0 box-shadows** with subtle 1px hairline soft borders.

- **Medium.com Imitating Writer**:
  - **Inline Floating Selection Toolbar**: Appears on text selection (**Bold**, *Italic*, 🔗 Link, **H1** Title, **H2** Subtitle, ❝ Quote with subtle background, and Code).
  - **Left-Side Plus (`+`) Button**: Placed on empty lines, expands to add images (upload/URL + caption), web embed preview cards, code blocks, and dividers.
  - **Client-Side AES-GCM 256-bit Encryption**: Private journals are encrypted in-memory before persisting.

- **Custom Slug Routing & Publishing**:
  - Full author control over publication slugs (e.g. `/@username/[your-custom-slug]` or `/story/[id]`).

- **Community Reading & Social Features**:
  - Medium-style **Upvotes / Claps** counter.
  - **Responses Drawer** to submit and applaud comments.
  - **Share Modal** with custom link copying and X/Twitter sharing.

- **Authentication Suite**:
  - Continue with **Google**
  - **Passkey (WebAuthn)** biometrics (Face ID / Touch ID)
  - **Email & Password** sign-in & registration
  - **Forgot Password** recovery flow

- **Minimalist Navigation**:
  - Top-left circular minimal vector emblem.
  - 1px hairline soft sidebar border.
  - iOS rounded squircle Home icon.
  - Bespoke Peacock Feather editorial writer icon.

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2, TypeScript 7.0, Vite 8.2
- **Styling**: Tailwind CSS 4.3 + Custom CSS Variables Theme Engine
- **Backend / Database**: Google Cloud Firestore + Firebase Auth 12.18
- **Cryptography**: Web Crypto API (PBKDF2 + AES-GCM 256-bit)
- **Authentication**: WebAuthn / Passkeys + Google OAuth + Email
- **Icons**: Lucide React 1.34

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/hi-ashwinsharma/tegaki.git
cd tegaki

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License

MIT © [Ashwin Sharma](https://github.com/hi-ashwinsharma)
