# Shivtej Real Estate — CSS Naming Reference
## File Loading Order

Every page that uses shared components must load files in this order:

```html
<link rel="stylesheet" href="{% static 'base.css' %}">       <!-- always first -->
<link rel="stylesheet" href="{% static 'login.css' %}">      <!-- page-specific -->
```

---

## File Responsibilities

| File           | What it owns                                                      |
|----------------|-------------------------------------------------------------------|
| `base.css`     | CSS tokens (`:root`), reset, alerts, form fields, buttons, brand logo, section titles, property-card shell, utilities |
| `login.css`    | Two-column layout, left panel, reset box                          |
| `signup.css`   | Two-column layout, left panel (steps variant), two-col form row   |
| `dashboard.css`| Sidebar, topbar, section switching, stat cards, modal, activity log |
| `home.css`     | Header/nav, hero, contact section, footer, scroll animations      |

---

## Naming Convention: BEM (Block__Element--Modifier)

```
.block                  → a standalone component
.block__element         → a child of that component
.block--modifier        → a variant/state of the block
.block__element--modifier → a variant of a child
```

---

## Shared Components (defined in base.css)

### Alert
```html
<div class="alert alert--error">Error message</div>
<div class="alert alert--success">Success</div>
<div class="alert alert--info">Info</div>
```

### Form Field
```html
<div class="form-field">
  <label class="form-field__label" for="my-input">Label</label>
  <input class="form-field__input" id="my-input" type="text">
</div>
```

### Buttons
```html
<button class="btn-primary">Primary action (full width, dark)</button>
<button class="btn-ghost">Secondary / outline action</button>
```

### Brand Logo
```html
<a href="/" class="brand-logo">
  <div class="brand-logo__icon">SR</div>
  <span class="brand-logo__text">Shivtej Real Estate</span>
</a>
```

### Auth Switch
```html
<p class="auth-switch">Already have an account? <a href="/login">Sign in</a></p>
```

### Section Header
```html
<p class="section-kicker">Eyebrow text</p>
<h2 class="section-title">Main heading</h2>
<p class="section-subtitle">Supporting copy</p>
```

### Property Card (shell — page CSS fills internals)
```html
<article class="property-card">
  <div class="property-card__image-wrapper"> … </div>
  <div class="property-card__body"> … </div>
</article>
```

---

## Login-Specific Classes (login.css)

| Class                          | What it is                          |
|-------------------------------|-------------------------------------|
| `.auth-panel-left`            | Dark left column                    |
| `.auth-panel-left__headline`  | Big serif heading + subtext         |
| `.auth-panel-left__stats`     | Row of stat numbers                 |
| `.auth-stat`                  | Single stat item                    |
| `.auth-stat__number`          | Large number (40px serif)           |
| `.auth-stat__label`           | Small label below number            |
| `.auth-panel-right`           | White right column                  |
| `.auth-form-container`        | Max-width wrapper inside right panel|
| `.auth-form-container__title` | "Welcome back" heading              |
| `.auth-form-container__desc`  | Subtitle below heading              |
| `.login-form__forgot-link`    | "Forgot password?" text button      |
| `.reset-box`                  | Collapsible password reset panel    |
| `.reset-box__title`           | "Reset your password" heading       |
| `.reset-box__row`             | Input + button side by side         |
| `.reset-box__input`           | Username input inside reset box     |
| `.reset-box__message`         | Status message (error/success)      |

---

## Signup-Specific Classes (signup.css)

| Class                           | What it is                          |
|--------------------------------|-------------------------------------|
| `.auth-panel-left`             | Dark left column (same shell)       |
| `.auth-panel-left__headline`   | Big serif heading + subtext         |
| `.auth-panel-left__steps`      | Vertical list of onboarding steps   |
| `.signup-step`                 | One step row (number + text)        |
| `.signup-step__number`         | Step number badge                   |
| `.signup-step__text`           | Step description                    |
| `.auth-panel-right`            | White right column                  |
| `.auth-form-container`         | Max-width form wrapper              |
| `.auth-form-container__title`  | "Create account" heading            |
| `.auth-form-container__desc`   | Subtitle                            |
| `.form-row--two-col`           | CSS grid, two equal columns         |
| `.signup-terms`                | Legal/terms small print             |

---

## Dashboard-Specific Classes (dashboard.css)

| Class                               | What it is                              |
|------------------------------------|------------------------------------------|
| `.sidebar`                         | Left navigation sidebar                  |
| `.sidebar__brand`                  | Logo inside sidebar                      |
| `.sidebar__user-chip`              | Avatar + username row                    |
| `.sidebar__user-avatar`            | Monogram circle                          |
| `.sidebar__user-name`              | Username text                            |
| `.sidebar__user-role`              | "Member" tag                             |
| `.sidebar__nav`                    | `<nav>` wrapper                          |
| `.sidebar__nav-group-label`        | "Main" / "Account" section labels        |
| `.sidebar__nav-item`               | Individual nav button                    |
| `.sidebar__nav-item.is-active`     | Currently selected nav item              |
| `.sidebar__nav-icon`               | Icon span inside nav item                |
| `.sidebar__nav-badge`              | Count pill on nav item                   |
| `.sidebar__footer`                 | Bottom of sidebar (logout)               |
| `.sidebar__logout-link`            | Logout button                            |
| `.sidebar-toggle-btn`              | Mobile hamburger button                  |
| `.sidebar-overlay`                 | Dim overlay for mobile sidebar           |
| `.dashboard-wrapper`               | Right side wrapper (topbar + content)    |
| `.dashboard-topbar`                | Top bar / header strip                   |
| `.dashboard-topbar__page-title`    | Dynamic page title in topbar             |
| `.dashboard-topbar__actions`       | Search + bell row                        |
| `.dashboard-topbar__search`        | Search input wrapper                     |
| `.dashboard-topbar__search-input`  | Actual search `<input>`                  |
| `.dashboard-topbar__notification-bell` | Bell icon button                    |
| `.dashboard-topbar__notification-dot` | Red dot indicator                    |
| `.dashboard-content`               | `<main>` scrollable content area         |
| `.dashboard-section`               | One full-page section (hidden by default)|
| `.dashboard-section.is-active`     | Currently visible section                |
| `.dashboard-section__empty-note`   | "Nothing here" fallback text             |
| `.overview__greeting-row`          | Date + greeting layout row               |
| `.overview__greeting-time`         | "Good morning" label                     |
| `.overview__greeting-headline`     | Large "Username, welcome back"           |
| `.overview__greeting-date`         | Current date string                      |
| `.overview__stat-cards`            | Four-column KPI grid                     |
| `.stat-card`                       | Individual KPI card                      |
| `.stat-card--dark`                 | Dark variant of stat card                |
| `.stat-card__label`                | Card label text                          |
| `.stat-card__value`                | Big number                               |
| `.stat-card__sublabel`             | Small supporting text                    |
| `.section-header`                  | Row: title-left + see-all-right          |
| `.section-header__left`            | Kicker + title side                      |
| `.section-header__see-all-btn`     | "See all →" ghost button                 |
| `.property-grid`                   | CSS grid of property cards               |
| `.property-card__image-wrapper`    | Image container with badge/save overlays |
| `.property-card__image`            | `<img>` inside card                      |
| `.property-card__image-placeholder`| Emoji fallback when no image             |
| `.property-card__badge`            | "Available" / "Recommended" pill         |
| `.property-card__save-btn`         | Heart button overlay on card             |
| `.property-card__body`             | Text area below image                    |
| `.property-card__title`            | Property name                            |
| `.property-card__location`         | City / area                              |
| `.property-card__price`            | Rent amount                              |
| `.saved-empty-state`               | Empty wishlist placeholder               |
| `.saved-empty-state__icon`         | Large heart icon                         |
| `.saved-empty-state__title`        | Heading                                  |
| `.saved-empty-state__desc`         | Subtitle                                 |
| `.preferences-grid`                | Two-column preference cards              |
| `.preference-card`                 | Single preference info card              |
| `.preference-card__label`          | Card section heading                     |
| `.preference-card__row`            | Key–value pair row                       |
| `.preference-card__key`            | Left label in row                        |
| `.preference-card__value`          | Right value in row                       |
| `.preference-card__status-tag`     | "Active" green pill                      |
| `.preference-card__empty-note`     | "No preferences set yet" text            |
| `.preference-card__edit-btn`       | "Update Preferences" button              |
| `.activity-log`                    | Activity section container               |
| `.activity-log__list`              | Inner list (populated by JS)             |
| `.property-modal`                  | Full-screen modal overlay                |
| `.property-modal__dialog`          | Modal dialog box                         |
| `.property-modal__gallery`         | Left image panel                         |
| `.property-modal__gallery-main-img`| Hero image                               |
| `.property-modal__gallery-badge`   | Type badge on image                      |
| `.property-modal__close-btn`       | ✕ close button                           |
| `.property-modal__gallery-counter` | "1 / 3" counter                          |
| `.property-modal__gallery-nav`     | ←/→ button wrapper                       |
| `.property-modal__gallery-nav-btn` | Individual nav arrow button              |
| `.property-modal__body`            | Right info panel                         |
| `.property-modal__header-row`      | Title + price side by side               |
| `.property-modal__title`           | Property name heading                    |
| `.property-modal__location`        | City/area below title                    |
| `.property-modal__price-block`     | Price + "per month" wrapper              |
| `.property-modal__price-value`     | ₹ amount                                 |
| `.property-modal__price-unit`      | "per month" label                        |
| `.property-modal__feature-chips`   | Feature tag row                          |
| `.property-modal__description-label` | "Description" heading                  |
| `.property-modal__description-text`  | Body copy                               |
| `.property-modal__thumbnail-strip` | Row of smaller images                    |
| `.property-modal__action-row`      | Call / WhatsApp / Save buttons           |
| `.property-modal__call-btn`        | Call Agent button                        |
| `.property-modal__whatsapp-btn`    | WhatsApp button                          |
| `.property-modal__save-btn`        | Save/heart button                        |
