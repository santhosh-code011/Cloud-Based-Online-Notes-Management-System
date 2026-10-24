/**
 * Cloud-Based Online Notes Management System - Backend Server
 * Built with Node.js built-in HTTP module (Zero external dependencies needed!)
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'notes_data.json');

// MIME types for static assets
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Seed initial cloud demo notes if file doesn't exist
const DEFAULT_NOTES = [
    {
        id: "note_1",
        title: "🚀 Welcome to CloudNotes Online System",
        content: "# Welcome to your Cloud Note Hub!\n\nThis application allows you to create, organize, and sync notes seamlessly.\n\n### Key Features:\n- ☁️ **Cloud Synchronization**: Real-time mock cloud and REST API storage.\n- 🏷️ **Categorization & Tags**: Organize by Work, Study, Ideas, and Custom Tags.\n- 📌 **Pinned & Starred**: Keep crucial notes at the top.\n- 🎨 **Color Themes**: Give each note a custom vibrant accent.\n- 🔍 **Instant Search**: Search across titles, content, and tags.\n- 💾 **Export & Backup**: Export as Markdown, TXT, or Full JSON Backup.",
        category: "Ideas",
        tags: ["welcome", "getting-started", "cloud"],
        color: "indigo",
        isPinned: true,
        isFavorite: true,
        isTrash: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "note_2",
        title: "📚 Cloud Computing Exam Preparation",
        content: "### Cloud Architecture Notes:\n1. **IaaS**: Infrastructure as a Service (EC2, Azure VMs, GCE).\n2. **PaaS**: Platform as a Service (Heroku, Firebase, App Engine).\n3. **SaaS**: Software as a Service (Google Workspace, Office 365).\n\n*Review virtualization and containerization (Docker, Kubernetes) tonight!*",
        category: "Study",
        tags: ["cloud", "exam", "revision"],
        color: "ocean",
        isPinned: true,
        isFavorite: false,
        isTrash: false,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
        id: "note_3",
        title: "💼 Project Sprint Planning & Milestones",
        content: "- [x] Initial UI/UX Wireframe & Design System\n- [x] RESTful API endpoints for Note CRUD\n- [ ] Database integration and cloud encryption\n- [ ] Multi-device sync testing\n- [ ] Final deployment to production server",
        category: "Work",
        tags: ["sprint", "milestone", "roadmap"],
        color: "emerald",
        isPinned: false,
        isFavorite: true,
        isTrash: false,
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// In-memory cloud database (keeps repository clean with strictly 6 files for GitHub)
let cloudNotesStore = JSON.parse(JSON.stringify(DEFAULT_NOTES));

// Helper: Read notes
function readNotesFromFile() {
    return cloudNotesStore;
}

// Helper: Save notes
function saveNotesToFile(notes) {
    cloudNotesStore = notes;
    return true;
}


// Helper: Parse incoming JSON request body
function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(new Error('Invalid JSON format'));
            }
        });
        req.on('error', err => reject(err));
    });
}

// Helper: Set standard CORS and JSON headers
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // --- API ROUTES ---

    // GET /api/notes
    if (pathname === '/api/notes' && req.method === 'GET') {
        const notes = readNotesFromFile();
        return sendJson(res, 200, { success: true, count: notes.length, notes });
    }

    // POST /api/notes (Create Note)
    if (pathname === '/api/notes' && req.method === 'POST') {
        try {
            const body = await parseRequestBody(req);
            const notes = readNotesFromFile();
            const newNote = {
                id: body.id || 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                title: body.title || 'Untitled Note',
                content: body.content || '',
                category: body.category || 'Personal',
                tags: Array.isArray(body.tags) ? body.tags : [],
                color: body.color || 'indigo',
                isPinned: Boolean(body.isPinned),
                isFavorite: Boolean(body.isFavorite),
                isTrash: Boolean(body.isTrash),
                createdAt: body.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            notes.unshift(newNote);
            saveNotesToFile(notes);
            return sendJson(res, 201, { success: true, message: 'Note created successfully', note: newNote });
        } catch (err) {
            return sendJson(res, 400, { success: false, message: err.message });
        }
    }

    // PUT /api/notes/:id (Update Note)
    if (pathname.startsWith('/api/notes/') && req.method === 'PUT') {
        const id = pathname.replace('/api/notes/', '').trim();
        try {
            const body = await parseRequestBody(req);
            let notes = readNotesFromFile();
            const index = notes.findIndex(n => n.id === id);

            if (index === -1) {
                return sendJson(res, 404, { success: false, message: 'Note not found' });
            }

            notes[index] = {
                ...notes[index],
                ...body,
                id: notes[index].id, // preserve id
                updatedAt: new Date().toISOString()
            };

            saveNotesToFile(notes);
            return sendJson(res, 200, { success: true, message: 'Note updated', note: notes[index] });
        } catch (err) {
            return sendJson(res, 400, { success: false, message: err.message });
        }
    }

    // DELETE /api/notes/:id (Delete permanently or move to trash)
    if (pathname.startsWith('/api/notes/') && req.method === 'DELETE') {
        const id = pathname.replace('/api/notes/', '').trim();
        const permanent = parsedUrl.query.permanent === 'true';

        let notes = readNotesFromFile();
        const index = notes.findIndex(n => n.id === id);

        if (index === -1) {
            return sendJson(res, 404, { success: false, message: 'Note not found' });
        }

        if (permanent) {
            notes.splice(index, 1);
        } else {
            notes[index].isTrash = true;
            notes[index].updatedAt = new Date().toISOString();
        }

        saveNotesToFile(notes);
        return sendJson(res, 200, { 
            success: true, 
            message: permanent ? 'Note permanently deleted' : 'Note moved to trash' 
        });
    }

    // POST /api/sync (Batch Synchronize from client)
    if (pathname === '/api/sync' && req.method === 'POST') {
        try {
            const body = await parseRequestBody(req);
            if (Array.isArray(body.notes)) {
                saveNotesToFile(body.notes);
                return sendJson(res, 200, { 
                    success: true, 
                    message: 'Cloud sync successful', 
                    count: body.notes.length,
                    timestamp: new Date().toISOString()
                });
            }
            return sendJson(res, 400, { success: false, message: 'Expected array of notes' });
        } catch (err) {
            return sendJson(res, 400, { success: false, message: err.message });
        }
    }

    // GET /api/stats (Cloud Storage & Notes Analytics)
    if (pathname === '/api/stats' && req.method === 'GET') {
        const notes = readNotesFromFile();
        const activeNotes = notes.filter(n => !n.isTrash);
        const trashNotes = notes.filter(n => n.isTrash);

        const categoryCounts = {};
        activeNotes.forEach(n => {
            const cat = n.category || 'Uncategorized';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const totalChars = notes.reduce((sum, n) => sum + (n.title?.length || 0) + (n.content?.length || 0), 0);
        const approxBytes = JSON.stringify(notes).length;

        return sendJson(res, 200, {
            success: true,
            totalNotes: notes.length,
            activeNotes: activeNotes.length,
            trashNotes: trashNotes.length,
            categories: categoryCounts,
            totalCharacters: totalChars,
            storageSizeBytes: approxBytes,
            storageSizeFormatted: (approxBytes / 1024).toFixed(2) + ' KB',
            serverTime: new Date().toISOString()
        });
    }

    // --- STATIC FILE SERVING ---
    let filePath = pathname === '/' ? '/index.html' : pathname;
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(__dirname, safePath);

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // If not found and not an API call, serve index.html for SPA behavior
                fs.readFile(path.join(__dirname, 'index.html'), (indexErr, indexContent) => {
                    if (indexErr) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(indexContent);
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

function startServer(port) {
    server.listen(port, () => {
        console.log(`=======================================================`);
        console.log(`  ☁️  Cloud-Based Online Notes Management System Server `);
        console.log(`  🌐  Local Server: http://localhost:${port}`);
        console.log(`  🚀  Ready for requests. Press Ctrl+C to stop.       `);
        console.log(`=======================================================`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} in use, trying port ${PORT + 1}...`);
        PORT++;
        startServer(PORT);
    } else {
        console.error('Server error:', err);
    }
});

startServer(PORT);

