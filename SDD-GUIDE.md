# 📐 SDD (Specification-Driven Development)

## ¿Qué es SDD?

**Specification-Driven Development** es un enfoque de desarrollo donde:

1. ✍️ **Primero** escribes la especificación detallada
2. 💻 **Segundo** implementas el código siguiendo la spec
3. ✅ **Tercero** validas que el código cumple la spec

## Este Proyecto: Torneo de Asados

Este proyecto fue desarrollado siguiendo **SDD puro**:

### 📚 Especificaciones Modulares

Las especificaciones están separadas por feature en la carpeta [`specs/`](./specs/):

```
specs/
├── README.md                    # Índice de especificaciones
├── SDD-ARCHITECTURE.md          # Arquitectura y mapeo
├── 00-overview.md               # Contexto general
├── 01-users.md                  # Feature: Users
├── 02-asados.md                 # Feature: Asados
├── 03-participation.md          # Feature: Participation
├── 04-points.md                 # Feature: Points
├── 05-penalties.md              # Feature: Penalties
├── 06-rankings.md               # Feature: Rankings
├── 07-ui-pages.md               # UI Layer
└── 08-testing.md                # Testing & QA
```

### 🎯 Ventajas de la Separación Modular

| Aspecto | Antes (Monolítico) | Después (Modular) |
|---------|-------------------|-------------------|
| **Navegación** | 383 líneas en 1 archivo | ~100-200 líneas/archivo |
| **Búsqueda** | Ctrl+F en todo | Abrir archivo específico |
| **Git diffs** | Todo el archivo cambia | Solo feature afectada |
| **Dependencies** | Implícitas, confusas | Explícitas por feature |
| **Status** | Global | Por feature |
| **Escalabilidad** | Crece linealmente | Agregar archivos nuevos |

### 🔗 Dependencias Explícitas

Cada spec declara sus dependencias:

```markdown
## Dependencies
- **Requires**: Users (01-users.md), Asados (02-asados.md)
- **Blocks**: Rankings (06-rankings.md)
```

Esto permite:
- ✅ Entender el orden de implementación
- ✅ Identificar impactos de cambios
- ✅ Trabajar en paralelo en features independientes

### 📊 Status Tracking

Cada feature tiene su propio status:

```markdown
## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed
```

### 🧪 Test Scenarios Incluidos

Cada spec incluye casos de prueba:

```markdown
## Test Scenarios

### ✅ Basic Operations
1. Create user → Success
2. Get all users → Returns 8 users
3. Each user has id, name, birthday

### ✅ Edge Cases
1. User with 0 participations → Shows with 0 points
```

## 🎓 Beneficios del SDD

### Para Desarrolladores

1. **Claridad**: Sabes exactamente qué construir
2. **Validación**: Puedes verificar que tu código cumple la spec
3. **Onboarding**: Nuevos devs leen la spec y entienden el sistema
4. **Refactoring**: La spec es el contrato, el código puede cambiar

### Para Code Reviews

1. **Criterio objetivo**: ¿El código sigue la spec?
2. **Edge cases**: ¿Están cubiertos según la spec?
3. **Validaciones**: ¿Se aplican las reglas de negocio?

### Para Testing

1. **Casos de prueba**: Ya definidos en la spec
2. **Cobertura**: Validar cada escenario especificado
3. **Regresión**: Si falla, ¿qué parte de la spec rompió?

### Para Mantenimiento

1. **Documentación viva**: La spec está sincronizada con el código
2. **Cambios**: Primero actualizar spec, luego código
3. **Historia**: Git muestra evolución de specs

## 📖 Cómo Usar Este Repo

### Implementar una Feature

1. Lee el spec correspondiente: `specs/XX-feature.md`
2. Revisa las dependencias (sección "Dependencies")
3. Sigue el modelo de datos (sección "Data Model")
4. Implementa según reglas de negocio (sección "Business Rules")
5. Valida con casos de prueba (sección "Test Scenarios")

### Agregar Nueva Feature

1. Crea `specs/09-nueva-feature.md` usando el template
2. Define status, dependencies, overview
3. Especifica data model, API contracts, business rules
4. Agrega test scenarios
5. Implementa siguiendo la spec

### Revisar Código

1. Lee la spec de la feature modificada
2. Verifica que el código implementa la spec
3. Valida que los edge cases están cubiertos
4. Confirma que los tests pasan según la spec

## 🔍 Comparación: Antes vs Después

### Antes (Spec Monolítica)

**SPEC.md** (383 líneas):
```
0. Context
1. Goal
2. Core Features
  2.1 Users
  2.2 Asados
  2.3 Participation
  2.4 Points
  2.5 Penalties
  2.6 Rankings
3. Data Model
4. UI Pages
5. Simplified Rules
6. Technology Stack
...
```

**Problemas:**
- 🔴 Todo mezclado en un archivo
- 🔴 Difícil encontrar información específica
- 🔴 Cambios afectan todo el archivo en Git
- 🔴 No se ven dependencias entre features

### Después (Specs Modulares)

**specs/** (10 archivos organizados):
- Cada feature en su archivo
- Dependencies explícitas
- Status individual por feature
- Fácil navegación y búsqueda
- Git diffs limpios y específicos

## 🚀 Próximos Pasos

Si quieres agregar una nueva feature:

1. **Spec First**: Crea `specs/09-nueva-feature.md`
2. **Review Spec**: Valida con el equipo
3. **Implement**: Codifica siguiendo la spec
4. **Test**: Valida contra casos de prueba de la spec
5. **Deploy**: Marca feature como deployed en spec

## 📚 Recursos

- [specs/README.md](./specs/README.md) - Índice completo de specs
- [specs/SDD-ARCHITECTURE.md](./specs/SDD-ARCHITECTURE.md) - Mapeo detallado original → modular
- [SPEC.md](./SPEC.md) - Especificación monolítica original (referencia)

---

**Principio:** "La spec es la fuente de verdad. El código es la implementación de la spec."

---

Desarrollado con enfoque SDD por [Matias Arias](https://github.com/MatiasArias)

Last updated: 2026-01-18

