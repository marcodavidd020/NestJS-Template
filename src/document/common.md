# Componentes Comunes (Common)

El módulo `common` proporciona componentes reutilizables que siguen el principio DRY (Don't Repeat Yourself) y permiten mantener consistencia en toda la aplicación.

## Arquitectura

El módulo implementa una arquitectura de capas con los siguientes componentes:

- **Decoradores**: Permiten añadir metadatos y funcionalidad a clases y métodos
- **Guards**: Controlan el acceso a rutas basado en condiciones
- **Interceptores**: Modifican las respuestas y peticiones
- **Pipes**: Validan y transforman datos
- **Helpers**: Funciones utilitarias para tareas comunes
- **Serializadores**: Transforman entidades en respuestas API

## Estructura de Directorios

```
common/
├── constants/                 # Constantes globales
│   └── settings.ts           # Configuración compartida
├── decorators/                # Decoradores personalizados
│   ├── metadata/             # Para metadatos
│   │   └── user-types.decorator.ts
│   ├── requests/             # Para peticiones HTTP
│   │   └── logged-in-user.decorator.ts
│   └── validations/          # Para validación de datos
│       ├── UniqueUserEmail.ts
│       └── UserExists.ts
├── exceptions/                # Manejo de excepciones
│   └── http-exception.filter.ts
├── guards/                    # Protección de rutas
│   ├── jwt-auth.guard.ts
│   └── user-types.guard.ts
├── helpers/                   # Funciones auxiliares
│   ├── responses/            # Formateo de respuestas
│   │   ├── error.helper.ts
│   │   └── success.helper.ts
│   └── string.helper.ts      # Manipulación de strings
├── interfaces/                # Interfaces comunes
│   ├── inputs.interface.ts   # Para parametrización
│   └── search.interface.ts   # Para resultados paginados
├── interceptors/              # Interceptores
│   └── http-cache.interceptor.ts
├── pipes/                     # Pipes de validación
│   └── validation.pipe.ts
└── serializers/               # Transformadores de respuesta
    ├── model.serializer.ts    # Base para modelos
    ├── responses/            # Para respuestas API
    │   ├── error.serializer.ts
    │   └── success.serializer.ts
    └── validation/           # Para errores de validación
        └── validation-error.serializer.ts
```

## Componentes Principales

### Guards

| Guard | Descripción | Parámetros |
|-------|-------------|------------|
| `JwtAuthGuard` | Verifica autenticación mediante token JWT | Ninguno |
| `UserTypesGuard` | Verifica roles de usuario para acceso | Roles requeridos mediante `@UserTypes()` |

### Decoradores

| Decorador | Descripción | Parámetros | Ejemplo |
|-----------|-------------|------------|---------|
| `@UserTypes()` | Define roles permitidos | `...roles: string[]` | `@UserTypes('admin', 'editor')` |
| `@LoggedInUser()` | Obtiene usuario actual | `data?: string` (propiedad) | `@LoggedInUser() user` o `@LoggedInUser('id') userId` |
| `@UniqueUserEmail()` | Valida email único | `validationOptions?: ValidationOptions` | `@UniqueUserEmail() email: string` |
| `@UserExists()` | Valida existencia de usuario | `validationOptions?: ValidationOptions` | `@UserExists() userId: string` |

### Helpers de Respuesta

| Función | Descripción | Parámetros |
|---------|-------------|------------|
| `createSuccessResponse()` | Crea respuesta de éxito | `data: any, message?: string` |
| `createCreatedResponse()` | Respuesta para creación | `data: any, entityName?: string` |
| `createUpdatedResponse()` | Respuesta para actualización | `data: any, entityName?: string` |
| `createDeletedResponse()` | Respuesta para eliminación | `entityName?: string` |
| `createErrorResponse()` | Crea respuesta de error | `message?: string, statusCode?: number, errors?: any[]` |
| `createNotFoundResponse()` | Error 404 | `entityName?: string` |
| `createUnauthorizedResponse()` | Error 401 | `message?: string` |
| `createForbiddenResponse()` | Error 403 | `message?: string` |

### Helpers de String

| Función | Descripción | Ejemplo |
|---------|-------------|---------|
| `slugify()` | Convierte texto a formato URL | `slugify('Hola Mundo') // 'hola-mundo'` |
| `capitalize()` | Capitaliza primera letra | `capitalize('hola') // 'Hola'` |
| `kebabToCamel()` | Convierte kebab-case a camelCase | `kebabToCamel('user-name') // 'userName'` |
| `camelToKebab()` | Convierte camelCase a kebab-case | `camelToKebab('userName') // 'user-name'` |
| `stripHtml()` | Elimina etiquetas HTML | `stripHtml('<p>Texto</p>') // 'Texto'` |
| `truncate()` | Acorta texto a longitud máxima | `truncate('Texto largo', 5) // 'Texto...'` |

### Interceptores

| Interceptor | Descripción | Uso |
|-------------|-------------|-----|
| `HttpCacheInterceptor` | Caché para respuestas GET | `@UseInterceptors(HttpCacheInterceptor)` |

### Pipes

| Pipe | Descripción | Uso |
|------|-------------|-----|
| `ValidationPipe` | Validación avanzada de datos | Global o `@UsePipes(ValidationPipe)` |

## Constantes Importantes

Definidas en `constants/settings.ts`:

| Constante | Tipo | Descripción |
|-----------|------|-------------|
| `USER_TYPES_KEY` | string | Clave para metadatos de roles |
| `CURRENT_USER_KEY` | string | Identificador del usuario en solicitud |
| `CACHE_TTL` | number | Tiempo de vida del caché (segundos) |
| `DEFAULT_PAGE_SIZE` | number | Tamaño predeterminado de página |
| `MAX_PAGE_SIZE` | number | Tamaño máximo de página |
| `ERROR_MESSAGES` | object | Mensajes de error estandarizados |

## Serializadores

| Serializador | Descripción | Campos expuestos |
|--------------|-------------|------------------|
| `ModelSerializer` | Base para modelos | `id`, `createdAt`, `updatedAt` |
| `SuccessSerializer` | Respuestas exitosas | `success`, `message`, `data`, `timestamp` |
| `ErrorSerializer` | Respuestas de error | `success`, `message`, `statusCode`, `errors`, `timestamp` |
| `ValidationErrorSerializer` | Errores de validación | Como `ErrorSerializer` + errores detallados |

## Ejemplos de Uso

### Protección y Roles

```typescript
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserTypesGuard } from '../common/guards/user-types.guard';
import { UserTypes } from '../common/decorators/metadata/user-types.decorator';

@Controller('articulos')
export class ArticulosController {
  // Ruta protegida - solo usuarios autenticados
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() { ... }

  // Ruta protegida con roles - solo administradores
  @UserTypes('admin')
  @UseGuards(JwtAuthGuard, UserTypesGuard)
  @Post()
  create() { ... }
}
```

### Acceso al Usuario Actual

```typescript
import { LoggedInUser } from '../common/decorators/requests/logged-in-user.decorator';
import { IJwtUser } from '../authentication/interfaces/jwt-user.interface';

@Get('perfil')
@UseGuards(JwtAuthGuard)
getMyProfile(@LoggedInUser() user: IJwtUser) {
  return this.usersService.findById(user.id);
}

// Solo acceder al ID
@Get('mis-compras')
@UseGuards(JwtAuthGuard)
getMyOrders(@LoggedInUser('id') userId: string) {
  return this.ordersService.findByUserId(userId);
}
```

### Respuestas Formateadas

```typescript
import { createSuccessResponse, createCreatedResponse } from '../common/helpers/responses/success.helper';
import { createNotFoundResponse } from '../common/helpers/responses/error.helper';

@Get(':id')
async findOne(@Param('id') id: string) {
  const entity = await this.service.findById(id);
  if (!entity) {
    throw new NotFoundException(
      createNotFoundResponse('Artículo')
    );
  }
  return createSuccessResponse(entity);
}

@Post()
async create(@Body() data) {
  const created = await this.service.create(data);
  return createCreatedResponse(created, 'Artículo');
}
```

### Validación de Datos

```typescript
import { UniqueUserEmail } from '../common/decorators/validations/UniqueUserEmail';

export class CreateUserDto {
  @IsEmail()
  @UniqueUserEmail()
  email: string;
  
  // Otras propiedades...
}
``` 