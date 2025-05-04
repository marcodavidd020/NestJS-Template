/**
 * Interfaces para resultados de búsqueda paginados
 */

/**
 * Interfaz para meta-información de paginación
 */
export interface IPaginationMeta {
  itemCount: number; // Total de items en la página actual
  totalItems: number; // Total de items en todas las páginas
  itemsPerPage: number; // Cantidad de items por página
  totalPages: number; // Total de páginas
  currentPage: number; // Página actual
}

/**
 * Interfaz para links de navegación entre páginas
 */
export interface IPaginationLinks {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

/**
 * Interfaz para resultados paginados
 */
export interface IPaginatedResult<T> {
  items: T[];
  meta: IPaginationMeta;
  links?: IPaginationLinks;
}
