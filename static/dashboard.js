/**
 * dashboard.js — Shivtej Real Estate
 * Handles: sidebar nav, section switching, save/wishlist,
 *          property modal with gallery, live search, activity log.
 */

/* ============================================================
   1. DATA — injected from Django template via dashboard.html
   ============================================================ */

// PROPERTY_DATA and AGENT_PHONE are declared in dashboard.html
// using Django template tags so they have real server values.


/* ============================================================
   2. STATE
   ============================================================ */

const State = {
  // Persisted across page loads (localStorage)
  savedIds: JSON.parse(localStorage.getItem('sr_saved') || '[]'),

  // Session only
  viewedCount: 0,
  activityLog: JSON.parse(sessionStorage.getItem('sr_activity') || '[]'),

  // Modal gallery state
  modal: {
    currentPropertyId: null,
    images: [],
    currentImageIndex: 0,
  },
};


/* ============================================================
   3. BOOT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  setGreeting();
  setCurrentDate();
  renderActivityLog();
  syncSavedButtonStates();
  updateSavedCount();
  document.getElementById('stat-viewed-count').textContent = 0;
});


/* ============================================================
   4. GREETING & DATE
   ============================================================ */

function setGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  document.getElementById('greeting-time-label').textContent = greeting;
}

function setCurrentDate() {
  const formatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  document.getElementById('current-date-display').textContent = formatted;
}


/* ============================================================
   5. SIDEBAR & SECTION NAVIGATION
   ============================================================ */

const SECTION_TITLES = {
  overview:     'Overview',
  recommended:  'Recommended',
  browse:       'Browse All',
  saved:        'Saved',
  preferences:  'My Preferences',
  activity:     'Activity',
};

/**
 * Switch to a dashboard section.
 * @param {string} sectionId - e.g. 'overview', 'saved'
 * @param {HTMLElement|null} clickedLink - the sidebar button that was clicked
 */
function navigateToSection(sectionId, clickedLink) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('is-active');
  });

  // Deactivate all nav links
  document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    link.classList.remove('is-active');
  });

  // Show the target section
  document.getElementById('section-' + sectionId).classList.add('is-active');

  // Activate the clicked nav link
  if (clickedLink) {
    clickedLink.classList.add('is-active');
  }

  // Update topbar title
  document.getElementById('topbar-page-title').textContent =
    SECTION_TITLES[sectionId] || sectionId;

  // Section-specific setup
  if (sectionId === 'saved') {
    renderSavedGrid();
  }

  // Close sidebar on mobile after navigation
  if (window.innerWidth < 900) {
    closeMobileSidebar();
  }

  window.scrollTo(0, 0);
}

function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('is-open');
  document.getElementById('sidebar-overlay').classList.toggle('is-open');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('is-open');
  document.getElementById('sidebar-overlay').classList.remove('is-open');
}


/* ============================================================
   6. SAVE / WISHLIST
   ============================================================ */

/**
 * Toggle a property's saved state.
 * @param {Event} event - click event (stopped from bubbling to card)
 * @param {number} propertyId
 */
function toggleSave(event, propertyId) {
  event.stopPropagation();

  const index = State.savedIds.indexOf(propertyId);
  if (index === -1) {
    State.savedIds.push(propertyId);
  } else {
    State.savedIds.splice(index, 1);
  }

  localStorage.setItem('sr_saved', JSON.stringify(State.savedIds));
  syncSavedButtonStates();
  updateSavedCount();
  logActivity('save', propertyId);
}

/**
 * Toggle save from inside the modal.
 */
function toggleSaveFromModal() {
  const propertyId = State.modal.currentPropertyId;
  if (!propertyId) return;

  toggleSave({ stopPropagation: () => {} }, propertyId);

  // Update modal save button appearance
  const isSaved = State.savedIds.includes(propertyId);
  document.getElementById('modal-save-button').textContent = isSaved ? '♥' : '♡';
}

/**
 * Sync all heart buttons on the page to reflect saved state.
 */
function syncSavedButtonStates() {
  document.querySelectorAll('.property-save-button').forEach(button => {
    const id = parseInt(button.dataset.propertyId);
    const isSaved = State.savedIds.includes(id);
    button.textContent = isSaved ? '♥' : '♡';
    button.classList.toggle('is-saved', isSaved);
  });
}

function updateSavedCount() {
  const count = State.savedIds.length;
  document.getElementById('saved-nav-badge').textContent = count;
  document.getElementById('stat-saved-count').textContent = count;
}

/**
 * Build the Saved section grid from State.savedIds.
 */
function renderSavedGrid() {
  const grid = document.getElementById('saved-properties-grid');
  const emptyState = document.getElementById('saved-empty-state');

  grid.innerHTML = '';

  if (State.savedIds.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  State.savedIds.forEach(id => {
    const property = PROPERTY_DATA[id];
    if (!property) return;

    const card = buildPropertyCard(property);
    grid.appendChild(card);
  });
}


/* ============================================================
   7. PROPERTY CARD BUILDER (used for Saved grid)
   ============================================================ */

/**
 * Create a property card DOM element programmatically.
 * @param {Object} property
 * @returns {HTMLElement}
 */
function buildPropertyCard(property) {
  const card = document.createElement('div');
  card.className = 'property-card';
  card.onclick = () => openModal(property.id);
  card.dataset.title = property.title.toLowerCase();
  card.dataset.area = property.area.toLowerCase();

  const firstImage = property.images[0] || '';
  const isSaved = State.savedIds.includes(property.id);

  card.innerHTML = `
    <div class="property-card-image-wrapper">
      ${firstImage
        ? `<img src="${firstImage}" class="property-card-image" alt="${property.title}">`
        : `<div class="property-card-image-placeholder">🏠</div>`
      }
      <span class="property-type-badge">${property.badge}</span>
      <button
        class="property-save-button ${isSaved ? 'is-saved' : ''}"
        data-property-id="${property.id}"
        onclick="toggleSave(event, ${property.id})"
      >${isSaved ? '♥' : '♡'}</button>
    </div>
    <div class="property-card-body">
      <div class="property-card-title">${property.title}</div>
      <div class="property-card-location">📍 ${property.area}</div>
      <div class="property-card-price">₹ ${property.rent}</div>
    </div>
  `;

  return card;
}


/* ============================================================
   8. PROPERTY MODAL
   ============================================================ */

/**
 * Open the property modal for a given property ID.
 * @param {number} propertyId
 */
function openModal(propertyId) {
  const property = PROPERTY_DATA[propertyId];
  if (!property) return;

  State.modal.currentPropertyId = propertyId;
  State.modal.images = property.images.length ? property.images : [''];
  State.modal.currentImageIndex = 0;

  // Populate modal content
  document.getElementById('modal-property-title').textContent    = property.title;
  document.getElementById('modal-property-location').textContent = '📍 ' + property.area;
  document.getElementById('modal-price-value').textContent       = '₹ ' + property.rent;
  document.getElementById('modal-gallery-type-badge').textContent = property.badge;
  document.getElementById('modal-description-text').textContent  = property.description || 'No description provided.';

  // Feature chips
  const chips = [
    { icon: '🏠', label: property.type },
    { icon: '📍', label: property.area },
    { icon: '💰', label: '₹ ' + property.rent },
  ];
  document.getElementById('modal-feature-chips').innerHTML = chips
    .map(chip => `<span class="feature-chip"><span>${chip.icon}</span>${chip.label}</span>`)
    .join('');

  // Thumbnail strip
  document.getElementById('modal-thumbnail-strip').innerHTML = property.images
    .map((src, index) =>
      `<img
        src="${src}"
        class="modal-thumbnail ${index === 0 ? 'is-active' : ''}"
        onclick="jumpToGalleryImage(${index})"
        alt="Photo ${index + 1}"
      >`
    ).join('');

  // Save button state
  document.getElementById('modal-save-button').textContent =
    State.savedIds.includes(propertyId) ? '♥' : '♡';

  // Refresh gallery (image + counter)
  refreshGalleryDisplay();

  // Open overlay
  document.getElementById('modal-overlay').classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Track view
  State.viewedCount++;
  document.getElementById('stat-viewed-count').textContent = State.viewedCount;
  logActivity('view', propertyId);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('is-open');
  document.body.style.overflow = '';
  State.modal.currentPropertyId = null;
}

/**
 * Close modal when clicking the dark backdrop.
 */
function handleOverlayClick(event) {
  if (event.target === document.getElementById('modal-overlay')) {
    closeModal();
  }
}

/* Gallery navigation */

function refreshGalleryDisplay() {
  const images = State.modal.images;
  const index  = State.modal.currentImageIndex;
  const imgEl  = document.getElementById('modal-gallery-main-image');

  // Fade transition
  imgEl.style.opacity = '0';
  setTimeout(() => {
    imgEl.src = images[index] || '';
    imgEl.style.opacity = '1';
    imgEl.style.transition = 'opacity 0.25s';
  }, 80);

  // Counter
  document.getElementById('modal-gallery-counter').textContent =
    `${index + 1} / ${images.length}`;

  // Thumbnail active state
  document.querySelectorAll('.modal-thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('is-active', i === index);
  });
}

function goToNextImage() {
  const total = State.modal.images.length;
  State.modal.currentImageIndex = (State.modal.currentImageIndex + 1) % total;
  refreshGalleryDisplay();
}

function goToPrevImage() {
  const total = State.modal.images.length;
  State.modal.currentImageIndex = (State.modal.currentImageIndex - 1 + total) % total;
  refreshGalleryDisplay();
}

function jumpToGalleryImage(index) {
  State.modal.currentImageIndex = index;
  refreshGalleryDisplay();
}

// Keyboard navigation for modal
document.addEventListener('keydown', event => {
  const isModalOpen = document.getElementById('modal-overlay').classList.contains('is-open');
  if (!isModalOpen) return;

  if (event.key === 'Escape')      closeModal();
  if (event.key === 'ArrowRight')  goToNextImage();
  if (event.key === 'ArrowLeft')   goToPrevImage();
});


/* ============================================================
   9. AGENT CONTACT ACTIONS
   ============================================================ */

function callAgent() {
  window.location.href = `tel:${AGENT_PHONE}`;
}

function openWhatsApp() {
  const property = PROPERTY_DATA[State.modal.currentPropertyId];
  const message = property
    ? `Hi, I'm interested in "${property.title}" (${property.area}). Could you share more details?`
    : 'Hi, I need help with a property listing.';

  const cleanPhone = AGENT_PHONE.replace(/\D/g, '');
  window.open(
    `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
}


/* ============================================================
   10. LIVE SEARCH
   ============================================================ */

/**
 * Filter property cards in Browse All by title or area.
 * Also auto-navigates to Browse All section.
 * @param {string} query
 */
function handleSearchInput(query) {
  const q = query.toLowerCase().trim();

  document.querySelectorAll('#browse-properties-grid .property-card').forEach(card => {
    const titleMatch = (card.dataset.title || '').includes(q);
    const areaMatch  = (card.dataset.area  || '').includes(q);
    card.style.display = (!q || titleMatch || areaMatch) ? '' : 'none';
  });

  if (q) {
    // Switch to browse section when user starts typing
    const browseLink = document.querySelector('[data-section="browse"]');
    navigateToSection('browse', browseLink);
  }
}


/* ============================================================
   11. ACTIVITY LOG
   ============================================================ */

/**
 * Add an entry to the activity log.
 * @param {'view'|'save'|'pref'} type
 * @param {number} propertyId
 */
function logActivity(type, propertyId) {
  const property = PROPERTY_DATA[propertyId];

  const icons = { view: '⊡', save: '♡', pref: '◎' };

  let text = '';
  if (type === 'view') {
    text = property
      ? `You <strong>viewed</strong> "${property.title}"`
      : 'You viewed a property';
  } else if (type === 'save') {
    const isSaved = State.savedIds.includes(propertyId);
    text = property
      ? (isSaved
          ? `You <strong>saved</strong> "${property.title}"`
          : `You <strong>unsaved</strong> "${property.title}"`)
      : 'You updated your wishlist';
  } else if (type === 'pref') {
    text = 'You updated your <strong>preferences</strong>';
  }

  State.activityLog.unshift({
    type,
    text,
    icon: icons[type],
    timestamp: new Date().toLocaleTimeString(),
  });

  // Cap at 20 entries
  if (State.activityLog.length > 20) {
    State.activityLog.pop();
  }

  sessionStorage.setItem('sr_activity', JSON.stringify(State.activityLog));
  renderActivityLog();
}

/**
 * Render the activity log list into the DOM.
 */
function renderActivityLog() {
  const list = document.getElementById('activity-list');

  if (State.activityLog.length === 0) {
    list.innerHTML = '<p class="activity-empty-message">No activity yet.</p>';
    return;
  }

  list.innerHTML = State.activityLog.slice(0, 12).map(entry => `
    <div class="activity-item">
      <div class="activity-icon-dot type-${entry.type}">${entry.icon}</div>
      <div>
        <div class="activity-text">${entry.text}</div>
        <div class="activity-timestamp">${entry.timestamp}</div>
      </div>
    </div>
  `).join('');
}

function clearActivityLog() {
  State.activityLog = [];
  sessionStorage.removeItem('sr_activity');
  renderActivityLog();
}
