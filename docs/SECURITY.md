# Tegaki Security Architecture & Threat Mitigation

This document details the multi-layered security protocols, access control lists (ACLs), cryptographic primitives, and threat mitigation models deployed across **Tegaki (手書き)**.

---

## 1. Security Philosophy

Tegaki was built from day one on **Zero-Trust Privacy** and **Least Privilege Access**:
- Private reflections belong strictly to the author.
- The server never possesses keys required to read encrypted journals.
- Public actions (like clapping or reading) are strictly sandboxed and rate/diff validated.

---

## 2. Cryptographic Specifications

Private notebooks use standard Web Cryptography API (`crypto.subtle`) primitives:

| Component | Standard | Specification |
| :--- | :--- | :--- |
| **Symmetric Cipher** | AES-GCM | 256-bit key length, 12-byte initialization vector (IV), 128-bit authentication tag |
| **Key Derivation** | PBKDF2 | HMAC-SHA-256 with 100,000 iterations and 16-byte cryptographically secure salt |
| **Entropy Source** | `crypto.getRandomValues()` | Hardware-level OS cryptographic pseudo-random number generator (CSPRNG) |

---

## 3. Cloud Firestore Security Rules Matrix

Production rules deployed to project `tegaki-by-ashwin`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(authorId) {
      return (isAuthenticated() && request.auth.uid == authorId)
             || (!isAuthenticated() && authorId == 'guest-author');
    }

    function isValidArticlePayload() {
      let data = request.resource.data;
      return data.title is string && data.title.size() <= 500
        && data.content is string && data.content.size() <= 1000000
        && (data.subtitle == null || (data.subtitle is string && data.subtitle.size() <= 1000))
        && (data.slug == null || (data.slug is string && data.slug.size() <= 200))
        && data.visibility in ['private', 'published'];
    }

    match /articles/{articleId} {
      allow read: if resource == null 
                  || resource.data.visibility == 'published'
                  || isOwner(resource.data.authorId);

      allow create: if isValidArticlePayload();

      allow update: if (isOwner(resource.data.authorId) && isValidArticlePayload())
                    || (isAuthenticated() && resource.data.authorId == 'guest-author' && isValidArticlePayload())
                    || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes'])
                    || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes', 'updatedAt'])
                    || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['commentCount', 'updatedAt']);

      allow delete: if isOwner(resource.data.authorId);
    }

    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.resource.data.content is string 
                    && request.resource.data.content.size() <= 5000;
      allow update: if isOwner(resource.data.authorId)
                    || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes'])
                    || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes', 'updatedAt']);
      allow delete: if isOwner(resource.data.authorId);
    }
  }
}
```

---

## 4. Threat Matrix & Defense Strategy

### 4.1 Denial of Service & Storage Quota Exhaustion
- **Threat**: Malicious actors posting gigabyte-sized payloads to exhaust database capacity and billings.
- **Defense**: Firestore rules enforce strict byte and character ceilings (1MB for stories, 500 characters for titles, 5KB for comments).

### 4.2 Unauthorized Document Deletion / Modification
- **Threat**: Attackers issuing API calls to overwrite or wipe stories belonging to other authors.
- **Defense**: Firestore enforces `request.auth.uid == resource.data.authorId` on all `delete` and content `update` operations.

### 4.3 Clap & Upvote Counter Tampering
- **Threat**: Attackers forging updates to inject billions of artificial upvotes.
- **Defense**: Unauthenticated or reader updates are strictly limited to `affectedKeys().hasOnly(['upvotes'])` with atomic `increment(1)` assertions.

### 4.4 Private Note Exposure
- **Threat**: Scraping private notes via queries or direct ID guessing.
- **Defense**: Server-side rule blocks queries for private records unless caller UID matches `authorId`. Furthermore, private note bodies are stored as encrypted ciphertext.

---

## 5. Security Vulnerability Reporting

If you discover a potential vulnerability within Tegaki, please report it directly:
- **Security Contact**: `mailto:ashwin@tegaki.io`
- **PGP / Verification**: Available on request via [https://hi-ashwin.xyz](https://hi-ashwin.xyz)
