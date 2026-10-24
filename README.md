# ☁️ CloudNotes — Cloud-Based Online Notes Management System

> A modern, responsive, and aesthetic **Cloud-Based Online Notes Management System** built with zero external dependency overhead. Includes real-time cloud synchronization simulation, full RESTful backend API, markdown previewing, tags, categorization, and local offline resilience.

---

## 🌟 Key Features

- **☁️ Cloud Synchronization & Offline Mode**:
  - Auto-synchronization with local/cloud REST API server (`server.js`).
  - Seamless offline mode using `localStorage` caching with live sync status indicator dot (`Cloud Synced`, `Syncing...`, `Offline Mode`).
- **📝 Rich Note Editor & Markdown**:
  - Live split-view Markdown preview support (headings, code blocks, checklists, quotes, formatting).
  - Quick formatting toolbar (Bold, Italic, Strikethrough, H1/H2/H3, Bullet lists, Numbered lists, Tasks, Timestamp).
  - Live word count, character count, and estimated reading time.
- **🏷️ Organization & Categories**:
  - Default categories: *Personal, Work, Study, Ideas, Code, Projects*.
  - Ability to dynamically add custom categories.
  - Multi-tag tagging system with interactive tag cloud filters.
- **📌 Priority & Visual Customization**:
  - Pin crucial notes to the top.
  - Mark notes with a gold star favorite badge.
  - 7 custom note card color themes (Indigo, Violet, Ocean, Emerald, Amber, Rose, Slate).
- **🔍 Instant Search & Multi-Sort**:
  - Fast instant search across note titles, contents, and tags (`Ctrl + K` shortcut).
  - Sort by: Last Updated, Date Created, or Alphabetical (A-Z / Z-A).
  - Switch between responsive **Grid View** and compact **List View**.
- **📊 Cloud Analytics Dashboard**:
  - Monitor total notes count, word counts, cloud quota used, and interactive category distribution bars.
- **💾 Encrypted Backup & Sharing**:
  - One-click full JSON Cloud Backup download and restore.
  - Single note export to Markdown (`.md`), copy formatted text, or print to PDF.
  - Shareable cloud link generator.
- **🗑️ Trash & Recovery**:
  - Safe soft-delete to Trash Bin with one-click restoration or permanent destruction.
- **🌓 Dark & Light Modes**:
  - Tailored sleek dark theme and crisp modern light theme.

---

## 📁 Project Structure (Strictly 6 Files)

Designed to be lightweight and ultra-easy to commit and push to GitHub without giant folder trees or nested dependency issues:

```text
Cloud-Based Online Notes Management System/
│
├── index.html        # Main Application Interface & Modals
├── style.css         # Modern Glassmorphic CSS Design System
├── app.js            # Client Engine & Cloud Sync Controller
├── server.js         # Zero-Dependency Node.js REST API Server
├── package.json      # Project Metadata & Start Scripts
└── README.md         # Documentation & Setup Guide
```

---

## 🚀 How to Run the Project

### Option 1: Run with Node.js Server (Recommended)
1. Open your terminal or PowerShell in this folder:
   ```bash
   cd "Cloud-Based Online Notes Management System"
   ```
2. Start the built-in server (no `npm install` needed!):
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Option 2: Open Directly in Browser (Zero Server Needed)
You can directly double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari). The system will automatically run in offline/local storage mode with full feature availability!

---

## 🔗 RESTful API Endpoints (`server.js`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | Fetch all notes from cloud storage |
| `POST` | `/api/notes` | Create a new note |
| `PUT` | `/api/notes/:id` | Update note details |
| `DELETE` | `/api/notes/:id` | Soft delete to trash or permanently remove |
| `POST` | `/api/sync` | Batch synchronization from client |
| `GET` | `/api/stats` | Retrieve cloud storage usage & stats |

---

## 📤 Pushing to GitHub (Quick Commands)

Since there are only 6 clean source files, pushing to your GitHub repo is instantaneous:

```bash
git init
git add .
git commit -m "Initial commit: Cloud-Based Online Notes Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

---

## 📄 License
MIT License. Open for educational and commercial projects!
