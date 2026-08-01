# Card Dealer Toolkit

The official Visual Studio Code development toolkit and data pack automation suite for **Card Dealer** by Arrowsend Studio LLC.

`card-dealer-toolkit` provides syntax highlighting, custom file icons, schema validation, and folder shortcuts to make creating and maintaining custom content packs for Card Dealer fast and error-free.

---

## Features

### 🔍 Real-Time Schema Validation & Autocompletion
- **Instant Error Checking:** Hover tooltips and squiggly warnings flag missing required fields (like `setID`, `cardID`, or `gameID`) as you type.
- **Autocompletion:** Context-aware suggestions for key properties in `.card`, `.set`, `.pack`, `.game`, and `pack.manifest` files.

### 📁 Explorer Context Menu Integration
- Right-click any directory in the Explorer sidebar to quickly generate pre-structured templates:
  - **New Game Definition** (`.game`)
  - **New Set Definition** (`.set`)
  - **New Pack Definition** (`.pack`)
  - **New Card Definition** (`.card`)

### 🎨 Custom File Icon Theme
- Includes dedicated, custom-designed file icons for `.card`, `.set`, `.pack`, `.game`, and `.manifest` files so you can navigate your content packs visually at a glance.

### ⚙️ Enforced Data Pack Architecture
Tailored to fit Card Dealer's strict project folder layout:
- `cards/*.card`
- `sets/*.set`
- `packs/*.pack`
- `games/*.game`
- `pack.manifest`

---

## Requirements

- Visual Studio Code `v1.120.0` or higher.

---

## Extension Settings

This extension works out of the box and automatically associates custom file extensions (`.card`, `.set`, `.pack`, `.game`, `.manifest`) with the JSON language engine and Card Dealer schemas.

---

## Release Notes

### 0.0.1
- Initial release of the **Card Dealer Toolkit**.
- Added JSON schema validation for all Card Dealer data pack definitions.
- Added context menu command shortcuts for quick asset creation.
- Added custom file icon theme support.

---

**Developed by Arrowsend Studio LLC**