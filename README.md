# Tegaki (手書き)

> A minimalist journaling & publication platform replicating the tactile, distraction-free aesthetic of Medium.com writer with **zero gradients**, **zero shadows**, 4 calibrated reading themes, client-side AES-GCM 256-bit encryption for private journals, and custom author slug routing (`/@username/slug`).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg)
![AES-GCM](https://img.shields.io/badge/Crypto-AES--GCM--256-10B981.svg)

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

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS + Custom CSS Variables Theme Engine
- **Cryptography**: Web Crypto API (PBKDF2 + AES-GCM 256-bit)
- **Authentication**: WebAuthn / Passkeys + Google OAuth + Email
- **Icons**: Custom SVG Vector Icons + Lucide React

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
