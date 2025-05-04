/**
 * Constantes de configuración de la aplicación
 */

// Claves para metadatos
export const USER_TYPES_KEY = 'user-types';
export const CURRENT_USER_KEY = 'user';

// Configuración de cache
export const CACHE_TTL = 60; // segundos
export const CACHE_MAX_ITEMS = 100;

// Configuración de paginación
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Nombres de cookies/tokens
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado para realizar esta acción',
  FORBIDDEN: 'Acceso prohibido: permisos insuficientes',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION: 'Error de validación en los datos proporcionados',
};
