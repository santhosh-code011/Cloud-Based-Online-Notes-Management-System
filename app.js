/**
 * CloudNotes — Cloud-Based Online Notes Management System
 * Client-side Controller & Cloud Synchronization Engine
 */

// Application State
const state = {
    notes: [],
    categories: ['Personal', 'Work', 'Study', 'Ideas', 'Code', 'Projects'],
    activeFilter: 'all', // 'all', 'pinned', 'favorites', 'trash', or category name
    activeTag: null,
    searchQuery: '',
    sortMode: 'updated_desc',
    viewMode: 'grid', // 'grid' or 'list'
    currentEditingNote: null,
    isCloudConnected: false,
    theme: localStorage.getItem('cloudnotes_theme') || 'dark',
    activeModal: null
};

// Default seed data for offline / standalone mode
const SEED_NOTES = [
    {
        id: "note_1",
        title: "🚀 Welcome to CloudNotes Online System",
        content: "# Welcome to your Cloud Note Hub!\n\nThis application allows you to create, organize, and sync notes seamlessly.\n\n### Key Highlights:\n- ☁️ **Cloud Synchronization**: Real-time cloud sync with REST API.\n- 🏷️ **Categories & Tags**: Keep everything tidy and searchable.\n- 📌 **Pinned & Favorites**: Never lose track of urgent items.\n- 🎨 **Color Themes**: Vibrant visual hierarchy.\n- 🔍 **Instant Search**: Find anything in milliseconds.\n- 💾 **Encrypted Backup**: Export & restore with ease.",
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

// DOM Elements
const elements = {
    // Theme & Navigation
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
    sidebar: document.getElementById('sidebar'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    cloudStatusPill: document.getElementById('cloudStatusPill'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    syncNowBtn: document.getElementById('syncNowBtn'),

    // Sidebar Items & Counts
    navAllNotes: document.getElementById('navAllNotes'),
    navPinnedNotes: document.getElementById('navPinnedNotes'),
    navFavNotes: document.getElementById('navFavNotes'),
    navTrashNotes: document.getElementById('navTrashNotes'),
    countAll: document.getElementById('countAll'),
    countPinned: document.getElementById('countPinned'),
    countFav: document.getElementById('countFav'),
    countTrash: document.getElementById('countTrash'),
    categoriesList: document.getElementById('categoriesList'),
    btnPromptNewCategory: document.getElementById('btnPromptNewCategory'),
    tagCloud: document.getElementById('tagCloud'),
    storageValText: document.getElementById('storageValText'),
    storageProgressBar: document.getElementById('storageProgressBar'),

    // Main Workspace
    currentViewTitle: document.getElementById('currentViewTitle'),
    currentViewSubtitle: document.getElementById('currentViewSubtitle'),
    activeTagFilterContainer: document.getElementById('activeTagFilterContainer'),
    activeTagPill: document.getElementById('activeTagPill'),
    removeTagFilterBtn: document.getElementById('removeTagFilterBtn'),
    sortSelect: document.getElementById('sortSelect'),
    viewModeGrid: document.getElementById('viewModeGrid'),
    viewModeList: document.getElementById('viewModeList'),
    btnEmptyTrash: document.getElementById('btnEmptyTrash'),
    pinnedGroup: document.getElementById('pinnedGroup'),
    pinnedNotesGrid: document.getElementById('pinnedNotesGrid'),
    regularGroup: document.getElementById('regularGroup'),
    otherGroupHeading: document.getElementById('otherGroupHeading'),
    notesGrid: document.getElementById('notesGrid'),
    emptyState: document.getElementById('emptyState'),
    emptyTitle: document.getElementById('emptyTitle'),
    emptyDesc: document.getElementById('emptyDesc'),
    btnCreateFirstNote: document.getElementById('btnCreateFirstNote'),
    btnNewNoteNav: document.getElementById('btnNewNoteNav'),

    // Modals
    editorModalBackdrop: document.getElementById('editorModalBackdrop'),
    editorModalCard: document.getElementById('editorModalCard'),
    btnCloseEditor: document.getElementById('btnCloseEditor'),
    btnCancelEdit: document.getElementById('btnCancelEdit'),
    btnSaveNote: document.getElementById('btnSaveNote'),
    noteTitleInput: document.getElementById('noteTitleInput'),
    noteCategorySelect: document.getElementById('noteCategorySelect'),
    noteTagsInput: document.getElementById('noteTagsInput'),
    noteContentInput: document.getElementById('noteContentInput'),
    noteContentPreview: document.getElementById('noteContentPreview'),
    btnTabEdit: document.getElementById('btnTabEdit'),
    btnTabPreview: document.getElementById('btnTabPreview'),
    editorPinToggle: document.getElementById('editorPinToggle'),
    editorFavToggle: document.getElementById('editorFavToggle'),
    colorPickerGroup: document.getElementById('colorPickerGroup'),
    wordCountText: document.getElementById('wordCountText'),
    charCountText: document.getElementById('charCountText'),
    readTimeText: document.getElementById('readTimeText'),

    // Analytics Modal
    btnOpenStats: document.getElementById('btnOpenStats'),
    statsModalBackdrop: document.getElementById('statsModalBackdrop'),
    btnCloseStats: document.getElementById('btnCloseStats'),
    btnCloseStatsBottom: document.getElementById('btnCloseStatsBottom'),
    statTotalNotes: document.getElementById('statTotalNotes'),
    statTotalWords: document.getElementById('statTotalWords'),
    statStorageUsed: document.getElementById('statStorageUsed'),
    statPinnedCount: document.getElementById('statPinnedCount'),
    categoryDistributionBars: document.getElementById('categoryDistributionBars'),

    // Backup Modal
    btnOpenBackup: document.getElementById('btnOpenBackup'),
    backupModalBackdrop: document.getElementById('backupModalBackdrop'),
    btnCloseBackup: document.getElementById('btnCloseBackup'),
    btnCloseBackupBottom: document.getElementById('btnCloseBackupBottom'),
    btnDownloadBackup: document.getElementById('btnDownloadBackup'),
    backupFileInput: document.getElementById('backupFileInput'),

    // Share Modal
    shareModalBackdrop: document.getElementById('shareModalBackdrop'),
    btnCloseShare: document.getElementById('btnCloseShare'),
    btnCloseShareBottom: document.getElementById('btnCloseShareBottom'),
    shareLinkInput: document.getElementById('shareLinkInput'),
    btnCopyShareLink: document.getElementById('btnCopyShareLink'),
    btnCopyNoteText: document.getElementById('btnCopyNoteText'),
    btnExportNoteMarkdown: document.getElementById('btnExportNoteMarkdown'),
    btnPrintNote: document.getElementById('btnPrintNote'),

    // Toasts
    toastContainer: document.getElementById('toastContainer')
};

// Active Note in Editor Reference
let currentEditingId = null;
let currentSelectedColor = 'indigo';
let isEditorPinned = false;
let isEditorFav = false;
let noteToShare = null;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    applyTheme(state.theme);
    loadSavedCategories();
    await checkCloudAndLoadNotes();
    setupEventListeners();
    setupFormattingToolbar();
    updateUI();
});

/* ==========================================================================
   THEME ENGINE
   ========================================================================== */
function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cloudnotes_theme', theme);
}

function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
}

/* ==========================================================================
   DATA LOADING & CLOUD REST API
   ========================================================================== */
async function checkCloudAndLoadNotes() {
    setCloudStatus('syncing', 'Connecting to Cloud...');

    try {
        // Attempt connecting to the local/remote backend
        const response = await fetch('/api/notes', { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.notes)) {
                state.notes = data.notes;
                state.isCloudConnected = true;
                saveLocalNotes(state.notes);
                setCloudStatus('online', 'Cloud Synced');
                renderAll();
                return;
            }
        }
    } catch (err) {
        console.warn('Backend server not reachable, using offline LocalStorage mode:', err);
    }

    // Fallback: load from LocalStorage or seed data
    state.isCloudConnected = false;
    const localData = localStorage.getItem('cloudnotes_data');
    if (localData) {
        try {
            state.notes = JSON.parse(localData);
        } catch (e) {
            state.notes = SEED_NOTES;
        }
    } else {
        state.notes = SEED_NOTES;
        saveLocalNotes(state.notes);
    }
    setCloudStatus('offline', 'Offline / Local Mode');
    renderAll();
}

function saveLocalNotes(notes) {
    localStorage.setItem('cloudnotes_data', JSON.stringify(notes));
}

async function syncWithCloud() {
    elements.syncNowBtn.classList.add('spinning');
    setCloudStatus('syncing', 'Syncing...');

    try {
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes: state.notes })
        });

        if (response.ok) {
            const result = await response.json();
            state.isCloudConnected = true;
            setCloudStatus('online', 'Cloud Synced');
            showToast('All notes synchronized with Cloud Server!', 'success');
        } else {
            throw new Error('Sync failed with status ' + response.status);
        }
    } catch (err) {
        state.isCloudConnected = false;
        setCloudStatus('offline', 'Offline / Saved Locally');
        showToast('Offline: Notes saved in browser storage.', 'warning');
    } finally {
        saveLocalNotes(state.notes);
        elements.syncNowBtn.classList.remove('spinning');
        updateUI();
    }
}

function setCloudStatus(type, message) {
    elements.statusDot.className = 'status-indicator-dot ' + type;
    elements.statusText.textContent = message;
}

/* ==========================================================================
   EVENT LISTENERS SETUP
   ========================================================================== */
function setupEventListeners() {
    // Theme toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Sidebar toggle (mobile & desktop)
    elements.sidebarToggleBtn.addEventListener('click', () => {
        elements.sidebar.classList.toggle('collapsed');
        elements.sidebar.classList.toggle('mobile-open');
    });

    // Global Search
    elements.globalSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        elements.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
        renderAll();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
        elements.globalSearchInput.value = '';
        state.searchQuery = '';
        elements.clearSearchBtn.style.display = 'none';
        renderAll();
    });

    // Keyboard Shortcut (Ctrl + K) for search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            elements.globalSearchInput.focus();
        }
    });

    // Force Cloud Sync Button
    elements.syncNowBtn.addEventListener('click', syncWithCloud);

    // Navigation Filters
    elements.navAllNotes.addEventListener('click', () => setViewFilter('all'));
    elements.navPinnedNotes.addEventListener('click', () => setViewFilter('pinned'));
    elements.navFavNotes.addEventListener('click', () => setViewFilter('favorites'));
    elements.navTrashNotes.addEventListener('click', () => setViewFilter('trash'));

    // Category Prompt
    elements.btnPromptNewCategory.addEventListener('click', promptNewCategory);

    // Sort Dropdown
    elements.sortSelect.addEventListener('change', (e) => {
        state.sortMode = e.target.value;
        renderAll();
    });

    // View Mode (Grid / List)
    elements.viewModeGrid.addEventListener('click', () => setViewMode('grid'));
    elements.viewModeList.addEventListener('click', () => setViewMode('list'));

    // Remove Tag Filter Pill
    elements.removeTagFilterBtn.addEventListener('click', () => {
        state.activeTag = null;
        elements.activeTagFilterContainer.style.display = 'none';
        renderAll();
    });

    // Empty Trash Button
    elements.btnEmptyTrash.addEventListener('click', emptyTrash);

    // New Note Buttons
    elements.btnNewNoteNav.addEventListener('click', () => openEditor());
    elements.btnCreateFirstNote.addEventListener('click', () => openEditor());

    // Editor Modals Close
    elements.btnCloseEditor.addEventListener('click', closeEditor);
    elements.btnCancelEdit.addEventListener('click', closeEditor);
    elements.btnSaveNote.addEventListener('click', saveNoteFromEditor);

    // Editor Toggles
    elements.editorPinToggle.addEventListener('click', () => {
        isEditorPinned = !isEditorPinned;
        elements.editorPinToggle.classList.toggle('active', isEditorPinned);
    });

    elements.editorFavToggle.addEventListener('click', () => {
        isEditorFav = !isEditorFav;
        elements.editorFavToggle.classList.toggle('active', isEditorFav);
    });

    // Color Dots in Editor
    elements.colorPickerGroup.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-dot')) {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            e.target.classList.add('active');
            currentSelectedColor = e.target.getAttribute('data-color');
        }
    });

    // Editor Tabs (Edit vs Preview)
    elements.btnTabEdit.addEventListener('click', () => switchEditorTab('edit'));
    elements.btnTabPreview.addEventListener('click', () => switchEditorTab('preview'));

    // Live Word / Char Counter in Editor
    elements.noteContentInput.addEventListener('input', updateEditorStats);

    // Stats Modal
    elements.btnOpenStats.addEventListener('click', openStatsModal);
    elements.btnCloseStats.addEventListener('click', closeStatsModal);
    elements.btnCloseStatsBottom.addEventListener('click', closeStatsModal);

    // Backup Modal
    elements.btnOpenBackup.addEventListener('click', openBackupModal);
    elements.btnCloseBackup.addEventListener('click', closeBackupModal);
    elements.btnCloseBackupBottom.addEventListener('click', closeBackupModal);
    elements.btnDownloadBackup.addEventListener('click', downloadBackup);
    elements.backupFileInput.addEventListener('change', restoreBackup);

    // Share Modal
    elements.btnCloseShare.addEventListener('click', closeShareModal);
    elements.btnCloseShareBottom.addEventListener('click', closeShareModal);
    elements.btnCopyShareLink.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.shareLinkInput.value);
        showToast('Share link copied to clipboard!', 'success');
    });
    elements.btnCopyNoteText.addEventListener('click', copyNoteToClipboard);
    elements.btnExportNoteMarkdown.addEventListener('click', exportNoteMarkdown);
    elements.btnPrintNote.addEventListener('click', printNote);

    // Backdrop Click to Close Modals
    [
        elements.editorModalBackdrop,
        elements.statsModalBackdrop,
        elements.backupModalBackdrop,
        elements.shareModalBackdrop
    ].forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.classList.remove('open');
            }
        });
    });
}

/* ==========================================================================
   FILTERING & NAVIGATION
   ========================================================================== */
function setViewFilter(filter) {
    state.activeFilter = filter;
    state.activeTag = null;
    elements.activeTagFilterContainer.style.display = 'none';

    // Update active nav button
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));

    if (filter === 'all') elements.navAllNotes.classList.add('active');
    else if (filter === 'pinned') elements.navPinnedNotes.classList.add('active');
    else if (filter === 'favorites') elements.navFavNotes.classList.add('active');
    else if (filter === 'trash') elements.navTrashNotes.classList.add('active');
    else {
        // Category selection
        const catEl = document.querySelector(`.cat-item[data-cat="${filter}"]`);
        if (catEl) catEl.classList.add('active');
    }

    renderAll();
}

function setViewMode(mode) {
    state.viewMode = mode;
    elements.viewModeGrid.classList.toggle('active', mode === 'grid');
    elements.viewModeList.classList.toggle('active', mode === 'list');
    elements.notesGrid.classList.toggle('list-view', mode === 'list');
    elements.pinnedNotesGrid.classList.toggle('list-view', mode === 'list');
}

/* ==========================================================================
   RENDER ENGINE
   ========================================================================== */
function renderAll() {
    updateCounts();
    renderCategories();
    renderTagCloud();
    renderNotes();
}

function updateCounts() {
    const active = state.notes.filter(n => !n.isTrash);
    const pinned = active.filter(n => n.isPinned);
    const fav = active.filter(n => n.isFavorite);
    const trash = state.notes.filter(n => n.isTrash);

    elements.countAll.textContent = active.length;
    elements.countPinned.textContent = pinned.length;
    elements.countFav.textContent = fav.length;
    elements.countTrash.textContent = trash.length;

    // Storage calculate
    const bytes = JSON.stringify(state.notes).length;
    const kb = (bytes / 1024).toFixed(1);
    elements.storageValText.textContent = `${kb} KB / 50 MB`;
    const pct = Math.min(Math.max((bytes / (50 * 1024 * 1024)) * 100, 2), 100);
    elements.storageProgressBar.style.width = `${pct}%`;
}

function renderCategories() {
    elements.categoriesList.innerHTML = '';
    state.categories.forEach(cat => {
        const count = state.notes.filter(n => !n.isTrash && n.category === cat).length;
        const btn = document.createElement('button');
        btn.className = `cat-item ${state.activeFilter === cat ? 'active' : ''}`;
        btn.setAttribute('data-cat', cat);
        btn.innerHTML = `
            <span><span class="cat-bullet" style="background: ${getCategoryColor(cat)}"></span>${cat}</span>
            <span class="nav-count">${count}</span>
        `;
        btn.addEventListener('click', () => setViewFilter(cat));
        elements.categoriesList.appendChild(btn);
    });

    // Update Category select in Editor modal
    const catSelect = elements.noteCategorySelect;
    const currentVal = catSelect.value;
    catSelect.innerHTML = '';
    state.categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        catSelect.appendChild(opt);
    });
    if (currentVal && state.categories.includes(currentVal)) {
        catSelect.value = currentVal;
    }
}

function getCategoryColor(cat) {
    const map = {
        'Personal': '#8b5cf6',
        'Work': '#6366f1',
        'Study': '#0ea5e9',
        'Ideas': '#10b981',
        'Code': '#f59e0b',
        'Projects': '#f43f5e'
    };
    return map[cat] || '#64748b';
}

function renderTagCloud() {
    const tagsMap = {};
    state.notes.filter(n => !n.isTrash).forEach(n => {
        if (Array.isArray(n.tags)) {
            n.tags.forEach(t => {
                const clean = t.trim().toLowerCase();
                if (clean) tagsMap[clean] = (tagsMap[clean] || 0) + 1;
            });
        }
    });

    elements.tagCloud.innerHTML = '';
    const sortedTags = Object.keys(tagsMap).sort();

    if (sortedTags.length === 0) {
        elements.tagCloud.innerHTML = '<span style="font-size:0.75rem; color:var(--text-muted); padding:0 4px;">No tags yet</span>';
        return;
    }

    sortedTags.forEach(tag => {
        const badge = document.createElement('span');
        badge.className = `tag-badge ${state.activeTag === tag ? 'active' : ''}`;
        badge.textContent = `#${tag} (${tagsMap[tag]})`;
        badge.addEventListener('click', () => {
            if (state.activeTag === tag) {
                state.activeTag = null;
                elements.activeTagFilterContainer.style.display = 'none';
            } else {
                state.activeTag = tag;
                elements.activeTagFilterContainer.style.display = 'inline-flex';
                elements.activeTagPill.textContent = `#${tag}`;
            }
            renderAll();
        });
        elements.tagCloud.appendChild(badge);
    });
}

function renderNotes() {
    let filtered = [...state.notes];

    // Filter by view tab / category
    if (state.activeFilter === 'all') {
        filtered = filtered.filter(n => !n.isTrash);
        elements.currentViewTitle.textContent = 'All Notes';
        elements.currentViewSubtitle.textContent = 'Showing all active cloud notes';
        elements.btnEmptyTrash.style.display = 'none';
    } else if (state.activeFilter === 'pinned') {
        filtered = filtered.filter(n => !n.isTrash && n.isPinned);
        elements.currentViewTitle.textContent = 'Pinned Notes';
        elements.currentViewSubtitle.textContent = 'Quick access to your most important notes';
        elements.btnEmptyTrash.style.display = 'none';
    } else if (state.activeFilter === 'favorites') {
        filtered = filtered.filter(n => !n.isTrash && n.isFavorite);
        elements.currentViewTitle.textContent = 'Starred Notes';
        elements.currentViewSubtitle.textContent = 'Notes you marked with a gold star';
        elements.btnEmptyTrash.style.display = 'none';
    } else if (state.activeFilter === 'trash') {
        filtered = filtered.filter(n => n.isTrash);
        elements.currentViewTitle.textContent = 'Trash Bin';
        elements.currentViewSubtitle.textContent = 'Deleted notes can be restored or emptied permanently';
        elements.btnEmptyTrash.style.display = filtered.length > 0 ? 'inline-flex' : 'none';
    } else {
        // Category view
        filtered = filtered.filter(n => !n.isTrash && n.category === state.activeFilter);
        elements.currentViewTitle.textContent = `${state.activeFilter} Notes`;
        elements.currentViewSubtitle.textContent = `Notes filed under category "${state.activeFilter}"`;
        elements.btnEmptyTrash.style.display = 'none';
    }

    // Filter by active Tag
    if (state.activeTag) {
        filtered = filtered.filter(n => n.tags && n.tags.some(t => t.toLowerCase() === state.activeTag.toLowerCase()));
    }

    // Filter by Search Query
    if (state.searchQuery) {
        filtered = filtered.filter(n => {
            const titleMatch = (n.title || '').toLowerCase().includes(state.searchQuery);
            const contentMatch = (n.content || '').toLowerCase().includes(state.searchQuery);
            const tagMatch = n.tags && n.tags.some(t => t.toLowerCase().includes(state.searchQuery));
            return titleMatch || contentMatch || tagMatch;
        });
    }

    // Sorting
    filtered.sort((a, b) => {
        if (state.sortMode === 'updated_desc') return new Date(b.updatedAt) - new Date(a.updatedAt);
        if (state.sortMode === 'updated_asc') return new Date(a.updatedAt) - new Date(b.updatedAt);
        if (state.sortMode === 'created_desc') return new Date(b.createdAt) - new Date(a.createdAt);
        if (state.sortMode === 'title_asc') return (a.title || '').localeCompare(b.title || '');
        if (state.sortMode === 'title_desc') return (b.title || '').localeCompare(a.title || '');
        return 0;
    });

    // Display Empty State if nothing matches
    if (filtered.length === 0) {
        elements.pinnedGroup.style.display = 'none';
        elements.otherGroupHeading.style.display = 'none';
        elements.notesGrid.innerHTML = '';
        elements.emptyState.style.display = 'flex';

        if (state.searchQuery) {
            elements.emptyTitle.textContent = 'No matching notes';
            elements.emptyDesc.textContent = `No notes found matching "${state.searchQuery}". Try a different search.`;
        } else if (state.activeFilter === 'trash') {
            elements.emptyTitle.textContent = 'Trash is empty';
            elements.emptyDesc.textContent = 'Items moved to trash will appear here.';
        } else {
            elements.emptyTitle.textContent = 'No Notes in this view';
            elements.emptyDesc.textContent = 'Create your first note or change your active filter.';
        }
        return;
    }

    elements.emptyState.style.display = 'none';

    // Separate into Pinned & Other if in 'All' view and some notes are pinned
    if (state.activeFilter === 'all' && !state.searchQuery && !state.activeTag) {
        const pinnedList = filtered.filter(n => n.isPinned);
        const regularList = filtered.filter(n => !n.isPinned);

        if (pinnedList.length > 0) {
            elements.pinnedGroup.style.display = 'flex';
            elements.pinnedNotesGrid.innerHTML = '';
            pinnedList.forEach(note => elements.pinnedNotesGrid.appendChild(createNoteCard(note)));

            elements.otherGroupHeading.style.display = regularList.length > 0 ? 'flex' : 'none';
            elements.notesGrid.innerHTML = '';
            regularList.forEach(note => elements.notesGrid.appendChild(createNoteCard(note)));
            return;
        }
    }

    // Default single list
    elements.pinnedGroup.style.display = 'none';
    elements.otherGroupHeading.style.display = 'none';
    elements.notesGrid.innerHTML = '';
    filtered.forEach(note => elements.notesGrid.appendChild(createNoteCard(note)));
}

function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = `note-card color-${note.color || 'indigo'}`;
    card.setAttribute('data-id', note.id);

    // Format Relative Time
    const timeFormatted = formatTimeAgo(note.updatedAt || note.createdAt);

    // Tags markup
    const tagsHtml = (note.tags || []).map(t => `<span class="card-tag">#${escapeHtml(t)}</span>`).join('');

    // Preview plain text stripped of markdown symbols
    const plainText = stripMarkdown(note.content || 'Empty note content...');

    card.innerHTML = `
        <div class="card-header">
            <span class="card-meta-badge">${escapeHtml(note.category || 'General')}</span>
            <div class="card-actions-quick" onclick="event.stopPropagation();">
                ${!note.isTrash ? `
                    <button class="card-action-btn ${note.isPinned ? 'active' : ''}" title="${note.isPinned ? 'Unpin' : 'Pin'}" data-action="pin">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.89A2 2 0 0 0 5 15.24Z"/></svg>
                    </button>
                    <button class="card-action-btn fav-btn ${note.isFavorite ? 'active' : ''}" title="${note.isFavorite ? 'Unfavorite' : 'Favorite'}" data-action="fav">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="${note.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>
                ` : ''}
            </div>
        </div>

        <h3 class="card-title">${escapeHtml(note.title || 'Untitled Note')}</h3>
        <p class="card-preview">${escapeHtml(plainText)}</p>

        ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}

        <div class="card-footer">
            <span class="card-time">${timeFormatted}</span>
            <div class="card-menu-row" onclick="event.stopPropagation();">
                ${!note.isTrash ? `
                    <button class="card-action-btn" title="Share Note" data-action="share">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                    <button class="card-action-btn" title="Edit Note" data-action="edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="card-action-btn" title="Move to Trash" data-action="trash">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                ` : `
                    <button class="card-action-btn" title="Restore Note" data-action="restore">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                    </button>
                    <button class="card-action-btn" title="Delete Permanently" data-action="delete-forever" style="color:var(--danger)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                `}
            </div>
        </div>
    `;

    // Card Click Opens Editor (unless in trash)
    card.addEventListener('click', () => {
        if (!note.isTrash) {
            openEditor(note.id);
        } else {
            showToast('Restore note to edit it.', 'info');
        }
    });

    // Quick Action button listeners
    const actionBtns = card.querySelectorAll('[data-action]');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.getAttribute('data-action');
            handleCardAction(note.id, action);
        });
    });

    return card;
}

function handleCardAction(noteId, action) {
    const note = state.notes.find(n => n.id === noteId);
    if (!note) return;

    if (action === 'pin') {
        note.isPinned = !note.isPinned;
        note.updatedAt = new Date().toISOString();
        showToast(note.isPinned ? 'Note pinned to top' : 'Note unpinned', 'info');
        syncWithCloud();
    } else if (action === 'fav') {
        note.isFavorite = !note.isFavorite;
        note.updatedAt = new Date().toISOString();
        showToast(note.isFavorite ? 'Added to favorites' : 'Removed from favorites', 'info');
        syncWithCloud();
    } else if (action === 'trash') {
        note.isTrash = true;
        note.updatedAt = new Date().toISOString();
        showToast('Note moved to Trash', 'info');
        syncWithCloud();
    } else if (action === 'restore') {
        note.isTrash = false;
        note.updatedAt = new Date().toISOString();
        showToast('Note restored successfully!', 'success');
        syncWithCloud();
    } else if (action === 'delete-forever') {
        if (confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
            state.notes = state.notes.filter(n => n.id !== noteId);
            showToast('Note permanently deleted', 'warning');
            syncWithCloud();
        }
    } else if (action === 'edit') {
        openEditor(noteId);
    } else if (action === 'share') {
        openShareModal(note);
    }
}

/* ==========================================================================
   NOTE EDITOR CONTROLLER
   ========================================================================== */
function openEditor(noteId = null) {
    currentEditingId = noteId;
    switchEditorTab('edit');

    if (noteId) {
        const note = state.notes.find(n => n.id === noteId);
        if (note) {
            elements.noteTitleInput.value = note.title || '';
            elements.noteCategorySelect.value = note.category || 'Personal';
            elements.noteTagsInput.value = (note.tags || []).join(', ');
            elements.noteContentInput.value = note.content || '';
            currentSelectedColor = note.color || 'indigo';
            isEditorPinned = Boolean(note.isPinned);
            isEditorFav = Boolean(note.isFavorite);
        }
    } else {
        // Blank new note
        elements.noteTitleInput.value = '';
        elements.noteCategorySelect.value = state.activeFilter !== 'all' && state.categories.includes(state.activeFilter) ? state.activeFilter : 'Personal';
        elements.noteTagsInput.value = state.activeTag ? state.activeTag : '';
        elements.noteContentInput.value = '';
        currentSelectedColor = 'indigo';
        isEditorPinned = false;
        isEditorFav = false;
    }

    // Highlight selected color dot
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-color') === currentSelectedColor);
    });

    elements.editorPinToggle.classList.toggle('active', isEditorPinned);
    elements.editorFavToggle.classList.toggle('active', isEditorFav);

    updateEditorStats();
    elements.editorModalBackdrop.classList.add('open');
    elements.noteTitleInput.focus();
}

function closeEditor() {
    elements.editorModalBackdrop.classList.remove('open');
    currentEditingId = null;
}

function saveNoteFromEditor() {
    const title = elements.noteTitleInput.value.trim() || 'Untitled Note';
    const content = elements.noteContentInput.value;
    const category = elements.noteCategorySelect.value || 'Personal';
    const rawTags = elements.noteTagsInput.value.split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(t => t.length > 0);

    const now = new Date().toISOString();

    if (currentEditingId) {
        // Update existing note
        const index = state.notes.findIndex(n => n.id === currentEditingId);
        if (index !== -1) {
            state.notes[index] = {
                ...state.notes[index],
                title,
                content,
                category,
                tags: rawTags,
                color: currentSelectedColor,
                isPinned: isEditorPinned,
                isFavorite: isEditorFav,
                updatedAt: now
            };
            showToast('Note updated & synced!', 'success');
        }
    } else {
        // Create new note
        const newNote = {
            id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            title,
            content,
            category,
            tags: rawTags,
            color: currentSelectedColor,
            isPinned: isEditorPinned,
            isFavorite: isEditorFav,
            isTrash: false,
            createdAt: now,
            updatedAt: now
        };
        state.notes.unshift(newNote);
        showToast('New cloud note created!', 'success');
    }

    closeEditor();
    syncWithCloud();
}

function switchEditorTab(tab) {
    if (tab === 'edit') {
        elements.btnTabEdit.classList.add('active');
        elements.btnTabPreview.classList.remove('active');
        elements.noteContentInput.style.display = 'block';
        elements.noteContentPreview.style.display = 'none';
    } else {
        elements.btnTabEdit.classList.remove('active');
        elements.btnTabPreview.classList.add('active');
        elements.noteContentInput.style.display = 'none';
        elements.noteContentPreview.style.display = 'block';
        elements.noteContentPreview.innerHTML = renderMarkdown(elements.noteContentInput.value);
    }
}

function updateEditorStats() {
    const text = elements.noteContentInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    const readTime = Math.max(1, Math.ceil(words / 200));

    elements.wordCountText.textContent = `${words} word${words === 1 ? '' : 's'}`;
    elements.charCountText.textContent = `${chars} char${chars === 1 ? '' : 's'}`;
    elements.readTimeText.textContent = `${readTime} min read`;
}

/* ==========================================================================
   FORMATTING TOOLBAR
   ========================================================================== */
function setupFormattingToolbar() {
    const textarea = elements.noteContentInput;

    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tool = btn.getAttribute('data-tool');
            insertFormatting(tool, textarea);
            updateEditorStats();
        });
    });
}

function insertFormatting(tool, textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (tool) {
        case 'bold':
            replacement = `**${selected || 'bold text'}**`;
            cursorOffset = selected ? replacement.length : 2;
            break;
        case 'italic':
            replacement = `*${selected || 'italic text'}*`;
            cursorOffset = selected ? replacement.length : 1;
            break;
        case 'strike':
            replacement = `~~${selected || 'strikethrough'}~~`;
            cursorOffset = selected ? replacement.length : 2;
            break;
        case 'h1':
            replacement = `\n# ${selected || 'Heading 1'}\n`;
            cursorOffset = replacement.length;
            break;
        case 'h2':
            replacement = `\n## ${selected || 'Heading 2'}\n`;
            cursorOffset = replacement.length;
            break;
        case 'h3':
            replacement = `\n### ${selected || 'Heading 3'}\n`;
            cursorOffset = replacement.length;
            break;
        case 'bullet':
            replacement = `\n- ${selected || 'List item'}\n`;
            cursorOffset = replacement.length;
            break;
        case 'number':
            replacement = `\n1. ${selected || 'List item'}\n`;
            cursorOffset = replacement.length;
            break;
        case 'check':
            replacement = `\n- [ ] ${selected || 'Task item'}\n`;
            cursorOffset = replacement.length;
            break;
        case 'quote':
            replacement = `\n> ${selected || 'Blockquote text'}\n`;
            cursorOffset = replacement.length;
            break;
        case 'code':
            if (selected.includes('\n')) {
                replacement = `\n\`\`\`javascript\n${selected}\n\`\`\`\n`;
            } else {
                replacement = `\`${selected || 'code'}\``;
            }
            cursorOffset = replacement.length;
            break;
        case 'time':
            const now = new Date().toLocaleString();
            replacement = ` [${now}] `;
            cursorOffset = replacement.length;
            break;
    }

    textarea.value = text.substring(0, start) + replacement + text.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
}

/* ==========================================================================
   MARKDOWN RENDERER & UTILITIES
   ========================================================================== */
function renderMarkdown(md) {
    if (!md) return '<p style="color:var(--text-muted); font-style:italic;">No content to preview.</p>';

    let html = escapeHtml(md);

    // Code blocks
    html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold, Italic, Strikethrough
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Checkboxes
    html = html.replace(/- \[x\] (.*$)/gim, '<div><input type="checkbox" checked disabled> $1</div>');
    html = html.replace(/- \[ \] (.*$)/gim, '<div><input type="checkbox" disabled> $1</div>');

    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
    html = html.replace(/<\/ol>\s*<ol>/g, '');

    // Paragraph line breaks
    html = html.replace(/\n\n/g, '<br><br>');

    return html;
}

function stripMarkdown(md) {
    return md
        .replace(/^#+\s+/gm, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/~~([^~]+)~~/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/- \[[ x]\] /g, '')
        .replace(/^[-*]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/^>\s+/gm, '')
        .trim();
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatTimeAgo(isoDate) {
    if (!isoDate) return 'Just now';
    const date = new Date(isoDate);
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ==========================================================================
   CATEGORY MANAGEMENT
   ========================================================================== */
function loadSavedCategories() {
    const saved = localStorage.getItem('cloudnotes_categories');
    if (saved) {
        try {
            state.categories = JSON.parse(saved);
        } catch (e) {
            console.error(e);
        }
    }
}

function promptNewCategory() {
    const name = prompt('Enter new category name:');
    if (name && name.trim()) {
        const clean = name.trim();
        if (!state.categories.includes(clean)) {
            state.categories.push(clean);
            localStorage.setItem('cloudnotes_categories', JSON.stringify(state.categories));
            renderCategories();
            showToast(`Category "${clean}" added!`, 'success');
        } else {
            showToast('Category already exists.', 'warning');
        }
    }
}

/* ==========================================================================
   ANALYTICS & STATS MODAL
   ========================================================================== */
function openStatsModal() {
    const active = state.notes.filter(n => !n.isTrash);
    const words = state.notes.reduce((acc, n) => {
        const text = (n.content || '').trim();
        return acc + (text ? text.split(/\s+/).length : 0);
    }, 0);
    const bytes = JSON.stringify(state.notes).length;
    const kb = (bytes / 1024).toFixed(2);
    const pinned = active.filter(n => n.isPinned).length;

    elements.statTotalNotes.textContent = state.notes.length;
    elements.statTotalWords.textContent = words.toLocaleString();
    elements.statStorageUsed.textContent = `${kb} KB`;
    elements.statPinnedCount.textContent = pinned;

    // Distribution Bars
    const catMap = {};
    active.forEach(n => {
        catMap[n.category] = (catMap[n.category] || 0) + 1;
    });

    elements.categoryDistributionBars.innerHTML = '';
    const total = active.length || 1;

    Object.keys(catMap).forEach(cat => {
        const count = catMap[cat];
        const pct = Math.round((count / total) * 100);
        const color = getCategoryColor(cat);

        const row = document.createElement('div');
        row.className = 'cat-bar-row';
        row.innerHTML = `
            <div class="cat-bar-label">
                <span><strong>${escapeHtml(cat)}</strong> (${count} notes)</span>
                <span>${pct}%</span>
            </div>
            <div class="cat-bar-track">
                <div class="cat-bar-fill" style="width: ${pct}%; background: ${color};"></div>
            </div>
        `;
        elements.categoryDistributionBars.appendChild(row);
    });

    elements.statsModalBackdrop.classList.add('open');
}

function closeStatsModal() {
    elements.statsModalBackdrop.classList.remove('open');
}

/* ==========================================================================
   BACKUP & RESTORE MODAL
   ========================================================================== */
function openBackupModal() {
    elements.backupModalBackdrop.classList.add('open');
}

function closeBackupModal() {
    elements.backupModalBackdrop.classList.remove('open');
}

function downloadBackup() {
    const exportData = {
        app: "CloudNotes Management System",
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        categories: state.categories,
        notes: state.notes
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudnotes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Backup JSON exported successfully!', 'success');
}

function restoreBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data && Array.isArray(data.notes)) {
                if (confirm(`Restore ${data.notes.length} notes from backup file? This will merge with existing notes.`)) {
                    // Merge by note id
                    const existingMap = new Map(state.notes.map(n => [n.id, n]));
                    data.notes.forEach(n => existingMap.set(n.id, n));
                    state.notes = Array.from(existingMap.values());

                    if (Array.isArray(data.categories)) {
                        const mergedCats = new Set([...state.categories, ...data.categories]);
                        state.categories = Array.from(mergedCats);
                        localStorage.setItem('cloudnotes_categories', JSON.stringify(state.categories));
                    }

                    syncWithCloud();
                    closeBackupModal();
                    showToast('Backup restored successfully!', 'success');
                }
            } else {
                showToast('Invalid backup file format.', 'error');
            }
        } catch (err) {
            showToast('Failed to parse backup file.', 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
}

/* ==========================================================================
   SHARE NOTE MODAL
   ========================================================================== */
function openShareModal(note) {
    noteToShare = note;
    elements.shareLinkInput.value = `${window.location.origin}/#note=${note.id}`;
    elements.shareModalBackdrop.classList.add('open');
}

function closeShareModal() {
    elements.shareModalBackdrop.classList.remove('open');
    noteToShare = null;
}

function copyNoteToClipboard() {
    if (!noteToShare) return;
    const text = `${noteToShare.title}\n\n${noteToShare.content}`;
    navigator.clipboard.writeText(text);
    showToast('Note content copied to clipboard!', 'success');
}

function exportNoteMarkdown() {
    if (!noteToShare) return;
    const mdContent = `# ${noteToShare.title}\n\n**Category:** ${noteToShare.category}\n**Tags:** ${(noteToShare.tags || []).join(', ')}\n\n---\n\n${noteToShare.content}`;
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(noteToShare.title || 'note').replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Markdown file downloaded!', 'success');
}

function printNote() {
    if (!noteToShare) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${escapeHtml(noteToShare.title)} - CloudNotes</title>
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 2rem; max-width: 800px; margin: auto; }
                    h1 { border-bottom: 2px solid #ccc; padding-bottom: 0.5rem; }
                    .meta { color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; }
                    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; }
                </style>
            </head>
            <body>
                <h1>${escapeHtml(noteToShare.title)}</h1>
                <div class="meta">Category: ${escapeHtml(noteToShare.category)} | Date: ${new Date(noteToShare.updatedAt).toLocaleString()}</div>
                <div>${renderMarkdown(noteToShare.content)}</div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function emptyTrash() {
    if (confirm('Are you sure you want to permanently empty the trash? All deleted notes will be permanently erased.')) {
        state.notes = state.notes.filter(n => !n.isTrash);
        syncWithCloud();
        showToast('Trash emptied permanently.', 'info');
    }
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'warning') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg} <span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

function updateUI() {
    renderAll();
}
