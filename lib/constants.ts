/**
 * -----------------------------------------------------------------------------
 * Application Constants
 * -----------------------------------------------------------------------------
 * This file centralizes constants used throughout the application to ensure
 * consistency and ease of maintenance. Storing constants here helps prevent
 * "magic numbers" or "magic strings" in the codebase, making it more readable
 * and less prone to errors.
 *
 * Usage:
 * Import constants from this file wherever they are needed.
 * Example: `import { TERMS_AND_CONDITIONS_VERSION } from '@/lib/constants'`
 * -----------------------------------------------------------------------------
 */

/**
 * Legal document versions.
 * These should be updated whenever a new version of a legal document is published.
 * This ensures that user consent is accurately logged against the correct version.
 */
export const TERMS_AND_CONDITIONS_VERSION = '1.0'
export const PRIVACY_POLICY_VERSION = '1.0' 