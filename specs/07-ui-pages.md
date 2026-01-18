# Feature: UI Pages & Navigation

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: All features (provides UI layer)
- **Blocks**: None (UI layer)

## Overview

Three main pages for the entire application. Simple navigation, mobile-first design using Tailwind CSS.

## Page Structure

### Page 1: Home / Rankings (`/`)

**Purpose**: Main landing page showing tournament rankings

**Layout:**
```
┌─────────────────────────────────────────┐
│ 🥩 Torneo de Asados                     │
│                                         │
│ [Crear Asado] [Ver Penalizaciones]     │
│                                         │
│ 📊 Estadísticas del Torneo             │
│ Total Asados: 12 | Promedio: 6.5       │
│                                         │
│ 🏆 Líder: Juan (45 puntos)             │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │  RANKINGS TABLE                 │    │
│ │  (see 06-rankings.md)           │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Components:**
- Header with title
- Quick action buttons
- Tournament stats summary
- Leader callout
- Rankings table (full)
- Footer (optional)

**Key Features:**
- Auto-refresh on every visit
- Mobile responsive
- Quick access to create asado

---

### Page 2: Create/Edit Asado (`/asados/nuevo`, `/asados/[id]`)

**Purpose**: Form to create new asado or edit existing one

**Layout:**
```
┌─────────────────────────────────────────┐
│ ← Back                                  │
│                                         │
│ Crear Asado / Editar Asado             │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ ASADO DETAILS FORM              │    │
│ │ - Name                          │    │
│ │ - Date                          │    │
│ │ - Time                          │    │
│ │ - Location                      │    │
│ │ - Host                          │    │
│ │ - Notes                         │    │
│ └─────────────────────────────────┘    │
│                                         │
│ Participantes                           │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ PARTICIPANTS TABLE              │    │
│ │ (see 03-participation.md)       │    │
│ │                                 │    │
│ │ All 8 users with checkboxes    │    │
│ │ for roles + live points         │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ⚠️ Warnings (if any)                   │
│                                         │
│ [Guardar] [Cancelar] [Eliminar]        │
└─────────────────────────────────────────┘
```

**Components:**
- Back button
- Asado details form (basic info)
- Participants table (checkboxes for each user)
- Live points preview
- Warnings (minimum attendees, etc.)
- Action buttons

**Key Features:**
- React Hook Form + Zod validation
- Live points calculation preview
- Real-time warnings
- Mobile-friendly inputs (date/time pickers)

**Helper Information:**
- "Último asador: Juan (hace 2 semanas)"
- "Sugerido: Pedro (hace 1 mes sin cocinar)"
- Not enforced, just helpful context

---

### Page 3: Penalties (`/penalties`)

**Purpose**: Manage penalties (view list, add new)

**Layout:**
```
┌─────────────────────────────────────────┐
│ ← Back                                  │
│                                         │
│ Penalizaciones                          │
│                                         │
│ [Agregar Penalty]                       │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ PENALTIES TABLE                 │    │
│ │                                 │    │
│ │ Fecha | Usuario | Pts | Razón  │    │
│ │ ----- | ------- | --- | ------ │    │
│ │ ...   | ...     | ... | ...    │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ℹ️ Helper Information                  │
│ - Próximo cumpleaños: Juan (15 mar)    │
│ - Sin hostear: Pedro, Carlos           │
└─────────────────────────────────────────┘
```

**Components:**
- Back button
- Add penalty button
- Penalties list table
- Helper info section

**Modal/Form for Adding Penalty:**
```
┌─────────────────────────────┐
│ Agregar Penalización        │
│                             │
│ Usuario: [dropdown]         │
│ Puntos: [number] (negative) │
│ Razón: [textarea]           │
│ Fecha: [date picker]        │
│ Asado: [dropdown] (opt)     │
│                             │
│ Quick Presets:              │
│ [-3] No hosteo              │
│ [-3] Comportamiento         │
│ [-1] Ausencia x3            │
│ [-1] Birthday missed        │
│                             │
│ [Guardar] [Cancelar]        │
└─────────────────────────────┘
```

**Key Features:**
- Simple table view
- Quick add with presets
- Delete functionality
- Helper reminders

---

## Navigation

### Global Navigation Bar (All Pages)

**Desktop:**
```
┌─────────────────────────────────────────┐
│ 🥩 Torneo de Asados   [Ranking] [Penalizaciones] [Crear Asado] │
└─────────────────────────────────────────┘
```

**Mobile (Hamburger Menu):**
```
☰  Torneo de Asados

Menu:
- 🏠 Ranking
- 📝 Crear Asado
- ⚠️ Penalizaciones
```

### URL Structure

| Page | URL | Purpose |
|------|-----|---------|
| Home/Rankings | `/` | Main page with rankings |
| Create Asado | `/asados/nuevo` | Create new asado |
| Edit Asado | `/asados/[id]` | Edit existing asado |
| Penalties | `/penalties` | View/manage penalties |

### Breadcrumbs (Optional)

Simple back button on sub-pages:
- `← Volver al Ranking` (from penalties)
- `← Volver al Ranking` (from asado form)

## Design System

### Colors (Tailwind)

**Primary:**
- Background: `bg-gray-50` (light) / `bg-gray-900` (dark)
- Primary: `bg-red-600` (asado theme)
- Secondary: `bg-orange-500`

**Status Colors:**
- Success: `text-green-600`
- Warning: `text-yellow-600`
- Error: `text-red-600`
- Neutral: `text-gray-600`

**Points:**
- Positive: `text-green-600 font-bold`
- Negative: `text-red-600`
- Zero: `text-gray-400`

### Typography

**Headings:**
- H1: `text-3xl font-bold`
- H2: `text-2xl font-semibold`
- H3: `text-xl font-medium`

**Body:**
- Regular: `text-base`
- Small: `text-sm`
- Tiny: `text-xs`

### Spacing

- Container: `max-w-7xl mx-auto px-4`
- Sections: `py-8`
- Cards: `p-6 rounded-lg shadow`

### Components

**Buttons:**
- Primary: `bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700`
- Secondary: `bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300`
- Danger: `bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200`

**Tables:**
- Header: `bg-gray-100 font-semibold`
- Row: `border-b hover:bg-gray-50`
- Mobile: Stack as cards

**Forms:**
- Input: `border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500`
- Label: `block text-sm font-medium text-gray-700 mb-1`
- Error: `text-red-600 text-sm mt-1`

**Badges:**
- 🥇 Gold: `bg-yellow-100 text-yellow-800`
- 🥈 Silver: `bg-gray-100 text-gray-800`
- 🥉 Bronze: `bg-orange-100 text-orange-800`

## Responsive Design

### Breakpoints (Tailwind)
- Mobile: `< 640px` (default)
- Tablet: `sm: >= 640px`
- Desktop: `md: >= 768px`
- Large: `lg: >= 1024px`

### Mobile Optimizations

**Rankings Table:**
- Desktop: Full table
- Mobile: Stack as cards

**Asado Form:**
- Desktop: Side-by-side fields
- Mobile: Stacked fields, full width

**Participants Table:**
- Desktop: Full table with all columns
- Mobile: Simplified view, expand details

**Navigation:**
- Desktop: Horizontal nav bar
- Mobile: Hamburger menu

## Accessibility

### Requirements
- Semantic HTML (`<table>`, `<form>`, `<nav>`)
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators on interactive elements
- Alt text for icons

### Form Accessibility
- Label all inputs
- Error messages associated with fields
- Required fields marked
- Clear validation feedback

## Loading & Error States

### Loading States
- Page load: Simple spinner
- Form submit: Button shows "Guardando..."
- Table load: Skeleton rows

### Error States
- API error: Toast notification
- Validation error: Inline under field
- Network error: Retry button

### Empty States
- No asados: "¡Crea el primer asado!"
- No penalties: "No hay penalizaciones registradas"
- No participations: "Ningún participante registrado"

## Implementation Details

### Files Structure
```
app/
├── layout.tsx           # Root layout with nav
├── page.tsx            # Home/Rankings page
├── asados/
│   ├── nuevo/
│   │   └── page.tsx   # Create asado
│   └── [id]/
│       └── page.tsx   # Edit asado
└── penalties/
    └── page.tsx       # Penalties page

components/
├── RankingsTable.tsx
├── AsadoForm.tsx
├── ParticipantsTable.tsx
├── PenaltyForm.tsx
├── PenaltyList.tsx
└── Navigation.tsx
```

### Form Validation (Zod)

```typescript
const asadoSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  location: z.string().min(1, "Ubicación requerida"),
  hostId: z.string().min(1, "Anfitrión requerido"),
  notes: z.string().optional(),
});

const participationSchema = z.object({
  asador: z.boolean(),
  calificacionAsado: z.number().min(1).max(5).optional(),
  // ... other fields
}).refine(
  data => !data.asador || data.calificacionAsado,
  { message: "Calificación requerida si es asador", path: ["calificacionAsado"] }
);
```

## Test Scenarios

### ✅ Navigation
1. Click "Crear Asado" → Navigates to `/asados/nuevo`
2. Click "Penalizaciones" → Navigates to `/penalties`
3. Click back button → Returns to home
4. Direct URL access → Loads correct page

### ✅ Forms
1. Submit empty form → Shows validation errors
2. Fill form and submit → Success, redirects to home
3. Cancel button → Returns without saving
4. Edit existing → Pre-fills form

### ✅ Responsive
1. Resize to mobile → Table becomes cards
2. Resize to desktop → Cards become table
3. Form fields stack on mobile
4. Navigation becomes hamburger on mobile

### ✅ Real-Time Updates
1. Change participant checkboxes → Points update immediately
2. Add participation → Warning updates if < 4 attendees
3. Create asado → Rankings update on home page

## Implementation Checklist
- [x] Root layout with navigation
- [x] Home/rankings page
- [x] Create asado page
- [x] Edit asado page
- [x] Penalties page
- [x] Rankings table component
- [x] Asado form component
- [x] Participants table component
- [x] Penalty form component
- [x] Navigation component
- [x] Mobile responsive design
- [x] Form validation with Zod
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Accessibility features

---

Last updated: 2026-01-18

