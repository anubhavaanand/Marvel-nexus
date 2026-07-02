## 2025-02-21 - Hardcoded Admin Password Fallback
**Vulnerability:** A hardcoded admin password fallback (`'Anubhav@12'`) was present in `src/app/actions/admin.ts`.
**Learning:** Hardcoded fallbacks are extremely dangerous and can inadvertently bypass authentication checks in production, especially when environment variables are omitted or misconfigured.
**Prevention:** Strictly require authentication environment variables and fail securely (e.g. by throwing an error or halting the server start) if they are not provided, rather than falling back to a default value.
