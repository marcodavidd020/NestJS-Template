# Sistema de Autenticación

El sistema de autenticación implementa un flujo completo basado en JWT (JSON Web Tokens) para la gestión segura de identidades.

## Arquitectura

El sistema implementa una arquitectura de autenticación basada en tokens con los siguientes componentes:

- **JWT Strategy**: Implementación personalizada de Passport para validación de tokens
- **Guards**: Protección de rutas basada en autenticación y roles
- **Decoradores**: Para extraer información del usuario actual y definir restricciones de acceso
- **Serialización**: Transformación segura de respuestas para eliminar datos sensibles

## Estructura de Directorios

```
authentication/
├── dto/                    # Data Transfer Objects
│   └── login.dto.ts        # Validación de datos de login
├── interfaces/             # Interfaces de datos
│   ├── jwt-payload.interface.ts  # Estructura del payload JWT
│   ├── jwt-user.interface.ts     # Usuario autenticado
│   ├── login.interface.ts        # Credenciales de login
│   └── token.interface.ts        # Estructura de tokens
├── serializers/            # Serializadores
│   └── token.serializer.ts # Respuesta serializada de tokens
├── auth.controller.ts      # Endpoints de autenticación
├── auth.module.ts          # Configuración del módulo
├── auth.service.ts         # Servicios de autenticación
└── jwt.strategy.ts         # Estrategia de autenticación
```

## Flujo de Autenticación

1. El cliente envía credenciales (email/password) a `/auth/login`
2. El sistema valida las credenciales contra la base de datos
3. Si son válidas, genera un token JWT con información mínima del usuario (id, email, roles)
4. El cliente almacena este token y lo incluye en cabeceras Authorization para peticiones posteriores
5. Los endpoints protegidos verifican la validez del token usando JwtAuthGuard
6. El payload decodificado se adjunta a la solicitud como `req.user`

## Endpoints

| Método | Ruta           | Descripción                  | Datos de entrada           | Respuesta                        |
|--------|----------------|------------------------------|----------------------------|----------------------------------|
| POST   | /auth/login    | Login y generación de token  | `{ email, password }`      | `{ accessToken, expiresIn, tokenType }` |
| GET    | /auth/profile  | Obtener perfil del usuario   | Token JWT (Authorization)  | Datos del usuario sin campos sensibles |

## Configuración

La configuración del sistema JWT se realiza en `config/auth/jwt/`:

```typescript
// Valores configurables
JWT_SECRET=mi_clave_secreta_super_segura
JWT_EXPIRES_IN=1h  // Formato: 1h, 7d, 60m, etc.
```

## Seguridad

El sistema implementa varias capas de seguridad:

- Contraseñas almacenadas con hash bcrypt (no en texto plano)
- Tokens JWT con tiempo de expiración configurable
- Validación de usuario activo en cada solicitud autenticada
- Payload mínimo en tokens para reducir exposición de datos

## Uso en Controladores

### Proteger una Ruta

```typescript
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('recursos')
export class RecursosController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getRecursos() {
    // Solo accesible para usuarios autenticados
    return [...];
  }
}
```

### Obtener Usuario Actual

```typescript
import { LoggedInUser } from '../common/decorators/requests/logged-in-user.decorator';
import { IJwtUser } from '../authentication/interfaces/jwt-user.interface';

@Get('mi-perfil')
@UseGuards(JwtAuthGuard)
getProfile(@LoggedInUser() user: IJwtUser) {
  // user contiene { id, email, roles }
  return this.service.getProfileData(user.id);
}
```

### Restringir por Roles

```typescript
import { UserTypes } from '../common/decorators/metadata/user-types.decorator';
import { UserTypesGuard } from '../common/guards/user-types.guard';

@Get('admin/estadisticas')
@UserTypes('admin', 'super_admin')
@UseGuards(JwtAuthGuard, UserTypesGuard)
getAdminStats() {
  // Solo accesible para usuarios con rol 'admin' o 'super_admin'
  return this.statsService.getAdminStatistics();
}
```

## Extensibilidad

El sistema está diseñado para ser extensible:

- Se puede agregar soporte para refresh tokens añadiendo los endpoints correspondientes
- Es posible implementar autenticación con proveedores externos (OAuth, OIDC) mediante estrategias adicionales
- La estructura permite añadir funcionalidades como bloqueo de cuenta tras intentos fallidos 