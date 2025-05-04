# Estructura General del Proyecto NestJS

## Organización de Capas

El proyecto está organizado en varias capas, cada una con responsabilidades específicas:

### 1. Configuración (`/config`)
Contiene los valores de configuración para diferentes aspectos del sistema:
- App (general)
- Cache (redis)
- Database (postgres, mysql, mongo)
- Queue (bull)
- Session (redis)
- Storage (filesystem, s3)

### 2. Proveedores (`/providers`)
Implementa los proveedores que crean conexiones a servicios externos:
- Cache (redis)
- Database (postgres, mysql, mongo)
- Mail (smtp)
- Queue (redis)

### 3. Modelos (`/models`)
Define las entidades del dominio y su lógica de negocio:
- Entidades (typeorm)
- Repositorios
- Servicios
- Controladores
- Serializadores

### 4. Database (`/database`)
Gestión de migraciones y datos iniciales:
- Migraciones
- Factories
- Seeders

## Estructura de Archivos

```
src/
├── config/           # Configuración
│   ├── app/
│   ├── cache/
│   ├── database/
│   ├── queue/
│   ├── session/
│   └── storage/
│
├── providers/        # Proveedores
│   ├── cache/
│   ├── database/
│   ├── mail/
│   └── queue/
│
├── models/           # Modelos
│   ├── common/
│   │   ├── repositories/
│   │   └── serializers/
│   ├── users/
│   └── addresses/
│
├── database/         # Base de datos
│   ├── migrations/
│   ├── factories/
│   └── seeders/
│
└── document/         # Documentación
    ├── configuracion-sistema.md
    ├── providers-estructura.md
    ├── database-estructura.md
    └── estructura-general.md (este archivo)
```

## Principios de Arquitectura

- **Modularidad**: Cada componente está encapsulado en módulos NestJS
- **Separación de Responsabilidades**: Cada capa tiene una responsabilidad clara
- **Inyección de Dependencias**: Uso del sistema de DI de NestJS
- **Configuración Centralizada**: Valores de configuración en un solo lugar
- **Reutilización**: Patrones comunes abstraídos en clases base 