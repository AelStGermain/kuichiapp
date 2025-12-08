# Implementation Plan - Data Security & Encryption

## Goal Description
Implement robust data security by encrypting local storage data and ensuring data segregation between different users on the same device.

## User Review Required
> [!IMPORTANT]
> This change will invalidate existing local data because the storage format and keys will change. Existing "plaintext" data might be lost or need migration (for this iteration, we will assume a fresh start or simple overwrite is acceptable as per "prototype" nature, but in production, a migration script would be needed).

## Proposed Changes

### Dependencies
#### [NEW] `crypto-js`
- Install `crypto-js` for AES encryption.
- Install `@types/crypto-js` for TypeScript support.

### Services

#### [NEW] `src/app/services/storage.service.ts`
- Create a new service `StorageService`.
- Implement `set(key, value)`: Encrypts value with AES using a secret key, then stores in localStorage.
- Implement `get(key)`: Retrieves from localStorage, decrypts, and parses JSON.
- Implement `remove(key)`.
- **Secret Key**: For this implementation, we will use a hardcoded environment-like constant. In a real app, this might be derived from the user's login token or a secure vault.

#### [MODIFY] `src/app/services/auth.service.ts`
- Add a method or property to easily get the current `uid`.

#### [MODIFY] `src/app/services/sync.service.ts`
- Inject `StorageService` instead of using `localStorage` directly.
- Update `sincronizarMascotas`, `importarDesdeAPI`, `loadLastSyncTime`, `saveLastSyncTime` to use `StorageService`.
- Use user-specific keys (e.g., `kuichi_last_sync_${uid}`).

### Pages

#### [MODIFY] `src/app/pages/mascotas/mascotas.page.ts`
- Inject `StorageService`.
- Update `load`, `saveStore`, `remove`, `clearAll` to use `StorageService`.
- Use user-specific keys (e.g., `kuichi_mascotas_${uid}`).
- Subscribe to `AuthService` to reload data when user changes (login/logout).

## Verification Plan

### Automated Tests
- Run `npm test` to ensure existing tests pass (might need to update mocks for `StorageService`).

### Manual Verification
1.  **Login as User A**: Create a pet.
2.  **Logout**.
3.  **Login as User B**: Verify list is empty (User A's pet not visible). Create a different pet.
4.  **Logout**.
5.  **Login as User A**: Verify User A's pet is visible and User B's is not.
6.  **Inspect LocalStorage**: Open DevTools -> Application -> Local Storage. Verify values are encrypted strings (ciphertext), not readable JSON.
