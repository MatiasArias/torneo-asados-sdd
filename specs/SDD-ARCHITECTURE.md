# 🏗️ Arquitectura SDD - Torneo de Asados

## Visión General de Especificaciones Modulares

Este documento muestra cómo la especificación monolítica original (`SPEC.md`) fue separada en módulos independientes para mejor mantenibilidad.

---

## 📊 Mapeo: Spec Original → Specs Modulares

### SPEC.md (Secciones) → specs/ (Archivos)

| Sección Original | Líneas | → | Nuevo Archivo | Feature |
|-----------------|--------|---|---------------|---------|
| 0. Context | 3-9 | → | `00-overview.md` | Contexto general |
| 1. Goal | 12-14 | → | `00-overview.md` | Objetivo del proyecto |
| 6. Technology Stack | 222-248 | → | `00-overview.md` | Stack tecnológico |
| 8. What We're NOT Building | 266-281 | → | `00-overview.md` | Scope limits |
| 12. Success Criteria | 367-376 | → | `00-overview.md` | Criterios de éxito |
| | | | |
| 2.1 Users | 19-25 | → | `01-users.md` | Users feature |
| 11. Initial Data | 346-363 | → | `01-users.md` | User seeding |
| | | | |
| 2.2 Asados | 27-36 | → | `02-asados.md` | Asados CRUD |
| 3.1 Asados Data Model | 109-119 | → | `02-asados.md` | Asado schema |
| 4.2 Create/Edit Asado | 158-179 | → | `02-asados.md` | Asado form UI |
| 5.1 Cook Rotation | 191-195 | → | `02-asados.md` | Helper suggestions |
| | | | |
| 2.3 Participation | 38-47 | → | `03-participation.md` | Participation system |
| 3.1 Participations Model | 120-135 | → | `03-participation.md` | Participation schema |
| 4.2 Participants Table | 167-179 | → | `03-participation.md` | Participation UI |
| 9.2 Can be asador+comprador? | 293-296 | → | `03-participation.md` | Edge cases |
| 9.3 Arrived on time AND late? | 297-299 | → | `03-participation.md` | Arrival rules |
| | | | |
| 2.4 Points Calculation | 48-66 | → | `04-points.md` | Points logic |
| 10. Testing Scenarios | 311-332 | → | `04-points.md` | Points tests |
| | | | |
| 2.5 Penalties | 67-79 | → | `05-penalties.md` | Penalties system |
| 3.1 Penalties Model | 136-145 | → | `05-penalties.md` | Penalty schema |
| 4.3 Penalties Page | 181-185 | → | `05-penalties.md` | Penalties UI |
| 5.2 Birthday Penalties | 197-201 | → | `05-penalties.md` | Birthday tracking |
| 5.3 Absence Tracking | 203-205 | → | `05-penalties.md` | Absence penalties |
| | | | |
| 2.6 Rankings | 81-92 | → | `06-rankings.md` | Rankings feature |
| 4.1 Home / Rankings | 153-157 | → | `06-rankings.md` | Rankings UI |
| 5.5 Tie-breaking | 213-218 | → | `06-rankings.md` | Tie-breaking rules |
| | | | |
| 4. UI Pages | 151-185 | → | `07-ui-pages.md` | All UI design |
| | | | |
| 7. Development Plan | 251-262 | → | `08-testing.md` | Implementation plan |
| 9. Edge Cases | 286-309 | → | `08-testing.md` | Edge case handling |
| 10. Testing Scenarios | 311-332 | → | `08-testing.md` | Test cases |
| 11. Deployment Checklist | 335-363 | → | `08-testing.md` | Deployment guide |

---

## 🎯 Ventajas de la Separación Modular

### ✅ Antes (Monolítico)
```
SPEC.md (383 líneas)
├─ Contexto
├─ Features mezclados
├─ UI mezclado con lógica
├─ Tests al final
└─ Todo en un archivo
```

**Problemas:**
- 🔴 Difícil de navegar (383 líneas)
- 🔴 Features mezcladas entre secciones
- 🔴 Cambios en una feature afectan todo el archivo
- 🔴 Difícil rastrear qué está implementado

### ✅ Después (Modular)

```
specs/
├── 00-overview.md (contexto general)
├── 01-users.md (feature completa)
├── 02-asados.md (feature completa)
├── 03-participation.md (feature completa)
├── 04-points.md (feature completa)
├── 05-penalties.md (feature completa)
├── 06-rankings.md (feature completa)
├── 07-ui-pages.md (UI layer)
├── 08-testing.md (QA layer)
└── README.md (índice navegable)
```

**Ventajas:**
- ✅ Cada feature en su propio archivo
- ✅ Fácil de navegar y buscar
- ✅ Dependencias explícitas entre features
- ✅ Status tracking por feature
- ✅ Mejor para versionado Git
- ✅ Escalable para nuevas features

---

## 🔗 Grafo de Dependencias

```
┌─────────────┐
│ 00-overview │ (base: context, tech stack)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  01-users   │ (foundational)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 02-asados   │ (depends on users)
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ 03-participation │ (depends on asados)
└────────┬─────────┘
         │
         ▼
┌─────────────┐         ┌──────────────┐
│  04-points  │────────▶│ 06-rankings  │
└──────┬──────┘         └──────▲───────┘
       │                       │
       ▼                       │
┌──────────────┐               │
│ 05-penalties │───────────────┘
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 07-ui-pages  │ (UI layer for all features)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 08-testing   │ (validation layer)
└──────────────┘
```

---

## 📋 Template para Nuevas Features

Cuando agregues una nueva feature, crea un archivo siguiendo este template:

```markdown
# Feature: [Nombre]

## Status
- [ ] Specified
- [ ] Implemented  
- [ ] Tested
- [ ] Deployed

## Dependencies
- **Requires**: [features previas]
- **Blocks**: [features que dependen de esta]

## Overview
[Descripción en 2-3 líneas]

## Specification
[Detalles técnicos completos]

## Data Model
[Estructura de datos en Vercel KV]

## API Contracts
[Endpoints y schemas TypeScript]

## Business Rules
[Reglas de negocio y validaciones]

## UI/UX
[Diseño de interfaz]

## Edge Cases
[Casos especiales y manejo de errores]

## Test Scenarios
[Casos de prueba con inputs/outputs esperados]

## Implementation Details
[Archivos afectados y funciones clave]

## Implementation Checklist
- [ ] Backend
- [ ] Frontend
- [ ] Tests
- [ ] Documentation

---

Last updated: [fecha]
```

---

## 📊 Estadísticas de Separación

| Métrica | Antes (Monolítico) | Después (Modular) |
|---------|-------------------|-------------------|
| **Archivos** | 1 archivo | 10 archivos |
| **Tamaño por archivo** | 383 líneas | ~100-200 líneas/archivo |
| **Navegabilidad** | Scroll largo | Links directos |
| **Git diffs** | Todo el spec | Solo feature afectada |
| **Buscar feature** | Ctrl+F en 383 líneas | Abrir archivo específico |
| **Dependencies** | Implícitas | Explícitas en cada spec |
| **Status tracking** | Global | Por feature |

---

## 🚀 Siguiente Paso: Implementación

Ahora que las specs están modulares:

1. **Desarrolladores** pueden implementar features independientemente
2. **Code reviews** pueden validar contra spec específico
3. **Tests** pueden referenciar la spec de la feature
4. **Nuevas features** pueden agregarse sin afectar specs existentes

---

**Principio SDD:** "Spec first, code second, test third"

Cada feature tiene su propia especificación completa antes de implementar.

---

Last updated: 2026-01-18

