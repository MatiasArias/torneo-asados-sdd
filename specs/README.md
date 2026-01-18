# Torneo de Asados - Specifications

Esta carpeta contiene la especificación modular del proyecto, separada por features para mejor mantenibilidad y claridad.

## 📚 Índice de Especificaciones

### 00. [Overview](./00-overview.md)
Contexto general, stack tecnológico, deployment y criterios de éxito.

### 01. [Users](./01-users.md)
Gestión de usuarios, lista fija de 8 participantes y cumpleaños.

### 02. [Asados](./02-asados.md)
Creación y gestión de eventos de asado (CRUD completo).

### 03. [Participation](./03-participation.md)
Sistema de participación y roles (asador, comprador, host, etc.).

### 04. [Points](./04-points.md)
Cálculo automático de puntos basado en participación y roles.

### 05. [Penalties](./05-penalties.md)
Sistema de penalizaciones manuales y automáticas.

### 06. [Rankings](./06-rankings.md)
Leaderboard con tie-breaking y estadísticas en tiempo real.

### 07. [UI Pages](./07-ui-pages.md)
Diseño de páginas, navegación y responsive design.

### 08. [Testing](./08-testing.md)
Escenarios de prueba, casos edge y checklist de deployment.

---

## 🔗 Dependencias entre Features

```
00-overview (base)
    ↓
01-users (foundational)
    ↓
02-asados
    ↓
03-participation
    ↓
04-points ──→ 06-rankings
    ↓           ↑
05-penalties ───┘
    ↓
07-ui-pages (UI layer)
    ↓
08-testing (validation)
```

---

## 📊 Estado del Proyecto

| Feature | Specified | Implemented | Tested | Deployed |
|---------|-----------|-------------|--------|----------|
| Overview | ✅ | ✅ | ✅ | ✅ |
| Users | ✅ | ✅ | ✅ | ✅ |
| Asados | ✅ | ✅ | ✅ | ✅ |
| Participation | ✅ | ✅ | ✅ | ✅ |
| Points | ✅ | ✅ | ✅ | ✅ |
| Penalties | ✅ | ✅ | ✅ | ✅ |
| Rankings | ✅ | ✅ | ✅ | ✅ |
| UI Pages | ✅ | ✅ | ✅ | ✅ |
| Testing | ✅ | ✅ | ✅ | ✅ |

**Status:** ✅ MVP Completo

---

## 🎯 Cómo Usar Esta Estructura

### Para Desarrolladores

1. **Implementar nueva feature**: Lee el spec correspondiente
2. **Entender dependencias**: Revisa las secciones "Dependencies" de cada spec
3. **Casos de prueba**: Cada spec incluye escenarios de test
4. **Modelo de datos**: Cada spec define su estructura de datos

### Para Revisión de Código

1. **Verificar alineación**: El código debe seguir el spec
2. **Casos edge**: Validar que los edge cases estén cubiertos
3. **Validaciones**: Confirmar que las reglas de negocio se aplican

### Para Nuevas Features (Post-MVP)

1. **Crear nuevo spec**: `specs/09-nueva-feature.md`
2. **Seguir template**:
   ```markdown
   # Feature: [Nombre]
   
   ## Status
   - [ ] Specified
   - [ ] Implemented
   - [ ] Tested
   - [ ] Deployed
   
   ## Dependencies
   - Requires: [features]
   - Blocks: [features]
   
   ## Overview
   [Descripción]
   
   ## Specification
   [Detalles técnicos]
   
   ## API Contracts
   [Endpoints]
   
   ## Business Rules
   [Lógica de negocio]
   
   ## Test Scenarios
   [Casos de prueba]
   
   ## Implementation Checklist
   - [ ] Items
   ```

---

## 📝 Notas

- **Spec original**: El archivo `SPEC.md` en la raíz contiene la especificación monolítica original
- **Sincronización**: Los specs modulares están sincronizados con el código actual
- **Última actualización**: 2026-01-18
- **Versión**: MVP 1.0

---

**Goal:** Spend more time having asados than managing the app. 🥩

