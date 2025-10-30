# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 boilerplate application with PocketBase authentication, built as a client-side rendered (SSR disabled) platform with internationalization support.

## Key Commands

### Development
```bash
yarn dev          # Start dev server on port 5555 (or NUXT_PORT env var)
yarn build        # Build for production
yarn generate     # Generate static site
yarn preview      # Preview production build locally
```

## Architecture

### Authentication System

The app implements a custom authentication layer using PocketBase as the backend:

**Server-side (server/utils/pocketbase.ts:5-60)**
- `createPocketBaseInstance()` creates a PocketBase client per request
- Manages session cookies with automatic token refresh (5-minute expiration window)
- Token refresh happens automatically when tokens are about to expire or are invalid
- Uses HTTP-only cookies for session management (`COOKIE_NAME` env var)

**Client-side (app/composables/useAuth.ts)**
- `useAuth()` composable provides authentication methods: `login()`, `register()`, `logout()`, `checkAuth()`, `updateProfile()`, `changePassword()`, `requestEmailChange()`, `deleteAccount()`
- `useAuthUser()` composable stores the current user state (persisted)
- Auth state is checked on app initialization via the `app/plugins/auth.ts` plugin

**Middleware**
- `auth-only.ts`: Redirects unauthenticated users to `/login`
- `guest-only.ts`: Prevents authenticated users from accessing auth pages

**API Endpoints**
All authentication endpoints are in `server/api/auth/`:
- `login.post.ts`, `register.post.ts`, `logout.post.ts`
- `me.get.ts` (check current auth status)
- `profile.patch.ts` (update user profile)
- `change-password.post.ts`, `request-password-reset.post.ts`
- `request-email-change.post.ts`, `delete-account.delete.ts`

### API Layer

**Error Handling (app/composables/useApiErrorHandler.ts)**
- Centralized error handling for API calls
- Automatically handles auth errors and redirects to login when unauthorized
- Displays toast notifications for errors

**API Wrapper (app/composables/useApi.ts)**
- `apiFetch()`: Wrapper around `$fetch` with integrated error handling
- `apiFetchWithRetry()`: Retry logic for failed requests (network/5xx errors, max 2 retries with exponential backoff)

### Internationalization

The app supports multiple locales using `@nuxtjs/i18n`:

**Configuration (nuxt.config.ts:10-27)**
- Strategy: `prefix_except_default` (English is default, French gets `/fr` prefix)
- Locales: English (en) and French (fr)
- Locale files: `i18n/en.json` and `i18n/fr.json`
- Fallback: `en-EN` (i18n.options.ts)

**Content Collections (content.config.ts)**
- Separate collections per locale: `content_en` and `content_fr`
- Content stored in `content/en/` and `content/fr/` directories
- Use `@nuxt/content` v3.6.3 with Zod schemas

### Page Structure

Pages use grouped folders with parentheses for organization:
- `app/pages/(auth)/`: Auth-related pages (login, forgot-password)
- `app/pages/(public)/`: Public pages (about, contact, privacy, terms)
- `app/pages/index.vue`: Homepage

Layouts:
- `app/layouts/dashboard.vue`: Dashboard layout for authenticated pages

### UI Configuration

**Nuxt UI (@nuxt/ui v4.1.0)**
- Primary color: `amber` (app/app.config.ts:4)
- Custom overlay styling for slideouts and modals with dark backgrounds

### Environment Variables

Required environment variables (configure in `.env`):
- `POCKETBASE_URL`: PocketBase backend URL (e.g., http://localhost:8090)
- `COOKIE_NAME`: Session cookie name (default: `__app_session`)
- `COOKIE_SECRET`: Cookie encryption secret
- `APP_NAME`: Application name (default: "app")
- `NUXT_PORT`: Development server port (default: 5555)

### File Uploads

**File URL Helper (app/composables/useFileUrl.ts)**
- Provides `getFileUrl()` to generate URLs for PocketBase file attachments
- Server endpoint: `server/api/files/[collection]/[recordId]/[filename].get.ts`

### State Management

**Persisted State (app/composables/usePersistedState.ts)**
- Custom composable for localStorage-backed reactive state
- Used by `useAuthUser()` to persist authentication state across page reloads

## Development Notes

- The app runs in client-side mode only (`ssr: false` in nuxt.config.ts:3)
- Uses Yarn as the package manager
- PocketBase must be running locally on port 8090 for authentication to work
- Dev server binds to `0.0.0.0` to allow network access
