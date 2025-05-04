/**
 * Helper para formatear respuestas exitosas
 */

/**
 * Crea una respuesta exitosa con formato estándar
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Operación exitosa',
) {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Crea una respuesta para operaciones de creación
 */
export function createCreatedResponse<T>(
  data: T,
  entityName: string = 'Recurso',
) {
  return createSuccessResponse(data, `${entityName} creado correctamente`);
}

/**
 * Crea una respuesta para operaciones de actualización
 */
export function createUpdatedResponse<T>(
  data: T,
  entityName: string = 'Recurso',
) {
  return createSuccessResponse(data, `${entityName} actualizado correctamente`);
}

/**
 * Crea una respuesta para operaciones de eliminación
 */
export function createDeletedResponse(entityName: string = 'Recurso') {
  return createSuccessResponse(null, `${entityName} eliminado correctamente`);
}
