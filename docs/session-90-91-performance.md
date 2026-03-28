# Sessions 90 & 91 — Performance write-up

This document summarizes the homepage orbital system work (**Session 90**) and the route transition / nav coordination work (**Session 91**). Both sessions target main-thread and GPU cost during the most interactive parts of the site without changing product behavior or visual identity in a noticeable way.

---

## Session 90 — Orbital card performance

**Goal:** Reduce layout work, redundant animation, video decode contention, and fullscreen blur cost for the ten floating project cards on the homepage.

**Files:** `src/components/ui/OrbitalCard.tsx`, `src/components/ui/OrbitalSystem.tsx`, `src/app/globals.css` (comment only for orbital panels).

### 1. Compositor positioning (`transform` instead of `left` / `top`)

Orbital physics still compute a center point `(x, y)` in viewport space. The change is **how that position is applied**:

- The card wrapper is `position: fixed` with `left: 0` and `top: 0` as a fixed anchor.
- Each frame writes **`transform: translate(x - 110px, y - 80px)`**, where `110` and `80` are half of the card footprint (`220×160`) so the visual center matches the previous `left`/`top` + `translate(-50%, -50%)` behavior.
- **`willChange: 'transform'`** on the wrapper (not `left`/`top`).

This keeps position updates on the compositor path and avoids per-frame layout invalidation from mutating `left`/`top`.

### 2. Pause orbital RAF off the homepage

`OrbitalSystem` already uses a single `requestAnimationFrame` loop (Session 87) that calls `tick(now)` on each card. Session 90 adds:

- `const isHome = pathname === '/'`
- The RAF effect returns early when **`!isHome`** (in addition to existing mobile / readiness guards).

When the user is on `/about`, `/timeline`, `/lab`, `/work/*`, etc., orbital physics do not run. Cards stay at their last transform until the user returns to `/`, where the loop restarts. Physics math is unchanged; only scheduling changes.

### 3. Single active video at a time

Rapid hover across MP4-backed cards could previously overlap `play()` across many elements. Session 90 centralizes playback in **`OrbitalSystem`**:

- **`activeVideoRef`** holds the currently allowed `<video>`.
- Each **`OrbitalCardHandle`** exposes **`getVideoElement(): HTMLVideoElement | null`**.
- Props **`onVideoHover(index)`** and **`onVideoLeave(index)`** pause any previous video, reset `currentTime`, then play or clear the active ref. Hover and chat activation both go through these paths.

At most one orbital MP4 plays at a time, which limits decode and main-thread work during fast pointer movement.

### 4. Orbital panel glass (Session 90 vs Session 92)

Session 90 briefly removed **`backdrop-filter`** from orbital bodies to cut GPU cost over the Swirl. **Session 92 restored frosted glass** with a structural fix: blur and tint live on a **dedicated absolute layer** (`inset: 0`, `z-index: 0`, `pointer-events: none`) with **`blur(5px)`** and **`backgroundColor: rgba(22, 26, 34, 0.92)`** — matching the original Session 20 card body. Idle / hover / active **opacity** is applied on a **sibling** **`opacityLayerRef`** wrapper, **not** on an ancestor of the blur layer (opacity on ancestors breaks **`backdrop-filter`** in WebKit/Blink).

**Explicitly unchanged elsewhere:** Nav, `ChatPanel`, `ChatOverlay`, sticky page chrome, and `TabBar` were never stripped of blur in Session 90.

### 5. What did not change

- **`Swirl.tsx`** — not modified (per project rules).
- Orbital physics constants and algorithms (spring, damping, collision, staging lerp, etc.).
- Mobile: orbital layer still unmounts (`useIsMobile()`), unchanged.

---

## Session 91 — Page transition performance

**Goal:** Avoid two large fixed layers animating in lockstep, narrow layout work during the 450ms route transition, and spurious nav width updates from `ResizeObserver` while the page is moving.

**Files:** `src/components/layout/PageTransitionWrapper.tsx`, `src/components/layout/NavWrapper.tsx`.

### 1. Stagger nav `top` animation (150ms)

The nav wrapper animates **`top`** when `hasChrome` toggles (tab bar clearance on deep routes). That used to run on the same clock as the full-viewport **`PageTransitionWrapper`** slide.

Session 91 adds a **150ms** delay to the CSS **`transition`** for `top` (fourth value in shorthand: `... 0.15s`), so the nav’s vertical move starts after the page transition is underway. The existing **60ms** `setTimeout` before updating `top` (Session 46) remains so the transition still has a distinct from-state.

**Constraint:** delay is exactly **150ms** unless a future session changes it explicitly.

### 2. Transition scope and compositor hints (`PageTransitionWrapper`)

The route **`motion.div`** now includes:

- **`willChange: 'transform, opacity'`** — hints promotion for the sliding layer.
- **`contain: 'layout style'`** — limits how layout/style changes inside the transition propagate.

A direct child wraps **`{children}`** with **`contain: 'layout'`** so new route trees are less likely to force full-document layout during the animation.

### 3. Global “transitioning” flag (`dataset`)

To coordinate other subscribers without a new React context:

- **`onAnimationStart`** sets **`document.documentElement.dataset.transitioning = 'true'`**.
- **`onAnimationComplete`** clears it **only when `useIsPresent()` is true** — i.e. when the **entering** page’s animation finishes, not when the **exiting** page finishes (otherwise the flag would drop between exit and enter under `AnimatePresence mode="wait"`).

This flag is intentionally simple for consumers that are not React components (e.g. `ResizeObserver`).

### 4. ResizeObserver guard (`NavWrapper`)

Desktop chat width tracks the measured nav pill via **`ResizeObserver`** → **`setDesktopNavWidthPx`**. During route transitions, layout noise can fire the observer.

The observer callback **returns early** if **`document.documentElement.dataset.transitioning === 'true'`**, so nav width does not churn mid-transition. When the flag clears after enter completes, the next observer fire or explicit `update()` path can sync width again.

### 5. What did not change

- **`Swirl.tsx`** — no particle-count or transition coupling (Swirl was not modified).
- Page transition **duration (0.45s)** and **easing** — unchanged.
- Framer **`AnimatePresence mode="wait"`** and route keys — unchanged.

---

## How to verify

| Area | Check |
|------|--------|
| Session 90 | DevTools: orbital wrapper uses `transform` for position updates, not `left`/`top` per frame. |
| Session 90 | Performance: on `/about`, no orbital RAF callbacks. |
| Session 90 | Hover sweep: only one MP4 plays at a time. |
| Session 91 | Nav `top` animation visibly lags the page slide slightly. |
| Session 91 | `document.documentElement.dataset.transitioning` present during transition, absent after enter settles. |
| Session 91 | Nav width / chat width stable: no ResizeObserver-driven width updates while `transitioning` is set. |

---

## Project references

Authoritative rules and copy live in **`claude.md`** and **`cursor.md`** (search “Session 90” / “Session 91”). This file is a narrative summary; if the two disagree, the project context files win.
