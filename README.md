# 🚀 NestJS - Estructura Base Profesional

[![NestJS](https://img.shields.io/badge/NestJS-8.x-E0234E.svg?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-FE0902.svg?style=flat-square)](https://typeorm.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000.svg?style=flat-square&logo=json-web-tokens)](https://jwt.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

Estructura base profesional para proyectos NestJS con arquitectura modular, siguiendo las mejores prácticas para aplicaciones empresariales escalables y mantenibles.

La estructura está inspirada en el artículo [Best Way to Structure Your Directory/Code (NestJS)](https://medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs-a06c7a641401).

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## 📋 Características

- ✅ **Arquitectura hexagonal** con clara separación de responsabilidades
- ✅ **Sistema de autenticación** completo con JWT
- ✅ **Control de acceso** basado en roles (RBAC)
- ✅ **Base de datos** con TypeORM configurado para múltiples proveedores
- ✅ **Migraciones automáticas** para gestión de esquema de BD
- ✅ **Seeders** para datos iniciales y pruebas
- ✅ **Validación** avanzada con class-validator y DTOs
- ✅ **Serialización** de respuestas con class-transformer
- ✅ **Interceptores** para transformación y caché de respuestas
- ✅ **Gestión de errores** centralizada y consistente
- ✅ **Testing** unitario y de integración preconfigurado
- ✅ **Documentación** detallada de cada módulo y componente

## 🔧 Requisitos previos

- **Node.js** v14.x o superior
- **npm** v6.x o superior (o **yarn**)
- **Base de datos** (MySQL, PostgreSQL, SQLite, etc.)
- **Git** para control de versiones

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/nestjs-base-structure.git
cd nestjs-base-structure

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus configuraciones

# Ejecutar migraciones
npm run migration:run

# Poblar datos iniciales
npm run seed:run

# Iniciar en modo desarrollo
npm run start:dev
```

## 🏗️ Estructura del proyecto

```
src/
├── app.module.ts            # Módulo principal de la aplicación
├── main.ts                  # Punto de entrada
├── authentication/          # Sistema de autenticación completo
│   ├── auth.controller.ts   # Endpoints de autenticación
│   ├── auth.service.ts      # Servicios de autenticación
│   ├── jwt.strategy.ts      # Estrategia de validación de tokens
│   └── interfaces/          # Tipos e interfaces
├── common/                  # Componentes compartidos reutilizables
│   ├── constants/           # Constantes globales
│   ├── decorators/          # Decoradores personalizados
│   ├── exceptions/          # Manejo de excepciones
│   ├── guards/              # Guards de seguridad
│   ├── helpers/             # Funciones auxiliares
│   ├── interceptors/        # Interceptores
│   ├── pipes/               # Pipes de validación
│   └── serializers/         # Transformadores de respuesta
├── config/                  # Configuraciones por entorno
│   ├── database/            # Configuración de bases de datos
│   ├── app/                 # Configuración de la aplicación
│   └── auth/                # Configuración de autenticación
├── database/                # Gestión de base de datos
│   ├── migrations/          # Migraciones de esquema
│   ├── seeders/             # Seeders para datos iniciales
│   └── factories/           # Factories para generación de datos
├── models/                  # Modelos y dominio de la aplicación
│   ├── common/              # Base común para modelos
│   ├── users/               # Módulo de usuarios
│   └── addresses/           # Módulo de direcciones
├── providers/               # Proveedores de servicios externos
│   ├── database/            # Proveedores de bases de datos
│   └── cache/               # Proveedores de caché
└── utils/                   # Utilidades y herramientas
```

## 📚 Documentación

Documentación detallada disponible en `src/document/`:

- [⚙️ Configuración del Sistema](src/document/configuracion-sistema.md)
- [🏛️ Estructura General](src/document/estructura-general.md)
- [🧩 Estructura de Modelos](src/document/estructura-modelos.md)
- [🔌 Estructura de Proveedores](src/document/providers-estructura.md)
- [🗃️ Estructura de Base de Datos](src/document/database-estructura.md)
- [🔄 Migraciones](src/document/database-migraciones.md)
- [🔐 Sistema de Autenticación](src/document/authentication.md)
- [🧰 Componentes Comunes](src/document/common.md)

## 💻 Comandos principales

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Inicia la aplicación en modo desarrollo con recarga automática |
| `npm run build` | Compila la aplicación para producción |
| `npm run start:prod` | Ejecuta la aplicación en modo producción |
| `npm run lint` | Verifica la calidad del código |
| `npm run test` | Ejecuta pruebas unitarias |
| `npm run test:e2e` | Ejecuta pruebas de integración |
| `npm run migration:generate` | Genera migraciones basadas en cambios de entidades |
| `npm run migration:run` | Ejecuta migraciones pendientes |
| `npm run migration:revert` | Revierte la última migración |
| `npm run seed:run` | Ejecuta seeders para datos iniciales |

## 🔍 Ejemplos de uso

### Autenticación de usuarios

```typescript
// POST /auth/login
const credentials = {
  email: 'usuario@ejemplo.com',
  password: 'contraseña123'
};

// Respuesta:
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "timestamp": "2023-10-27T12:00:00.000Z"
}
```

### Protección de rutas con roles

```typescript
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserTypes } from '../common/decorators/metadata/user-types.decorator';
import { UserTypesGuard } from '../common/guards/user-types.guard';

@Controller('admin')
export class AdminController {
  @Get('dashboard')
  @UserTypes('admin')
  @UseGuards(JwtAuthGuard, UserTypesGuard)
  getDashboard() {
    // Solo accesible para usuarios con rol 'admin'
    return this.adminService.getDashboardData();
  }
}
```

### Acceso al usuario actual

```typescript
import { LoggedInUser } from '../common/decorators/requests/logged-in-user.decorator';
import { IJwtUser } from '../authentication/interfaces/jwt-user.interface';

@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@LoggedInUser() user: IJwtUser) {
  return this.usersService.findById(user.id);
}
```

## 🛠️ Tecnologías principales

- **NestJS**: Framework progresivo para Node.js
- **TypeScript**: Superset tipado de JavaScript
- **TypeORM**: ORM para TypeScript y JavaScript
- **PostgreSQL/MySQL**: Base de datos relacional
- **JWT**: Autenticación con tokens
- **class-validator**: Validación de datos
- **class-transformer**: Serialización de respuestas
- **Jest**: Framework de testing

## 🤝 Contribución

Las contribuciones son bienvenidas y apreciadas! Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu funcionalidad/corrección (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add: amazing feature'`)
4. Sube la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

