# Feature: Asados Management

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: Users (01-users.md)
- **Blocks**: Participation (03-participation.md), Points (04-points.md)

## Overview

Core feature for creating, editing, and managing asado events. Each asado represents a gathering where friends meet to grill and socialize.

## Specification

### Asado Properties
- **ID**: Unique identifier (UUID)
- **Name**: Event name (string)
- **Date**: Event date (YYYY-MM-DD)
- **Time**: Start time (HH:MM) - used for arrival time calculations
- **Location**: Physical location (string)
- **Host ID**: User who hosts the event (foreign key to User)
- **Notes**: Optional additional information (string)

### Capabilities
- ✅ Create new asado
- ✅ Edit existing asado
- ✅ Delete asado
- ✅ View asado details
- ✅ List all asados

### Permissions
- **Trust-based**: Anyone can create/edit/delete any asado
- No confirmation needed for delete operations
- No ownership validation

## Data Model

### Vercel KV Structure

```json
{
  "asados": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Asado de Juan",
      "date": "2025-01-20",
      "time": "20:00",
      "location": "Casa de Juan",
      "hostId": "1",
      "notes": "Traer bebidas"
    }
  ]
}
```

### TypeScript Definition

```typescript
interface Asado {
  id: string;
  name: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  location: string;
  hostId: string;      // Reference to User
  notes?: string;
}
```

## API Contracts

### GET /api/asados
**Response:**
```typescript
{
  asados: Asado[]
}
```

### GET /api/asados/[id]
**Response:**
```typescript
{
  asado: Asado,
  participations: Participation[],
  host: User
}
```

### POST /api/asados
**Request:**
```typescript
{
  name: string;
  date: string;
  time: string;
  location: string;
  hostId: string;
  notes?: string;
}
```

**Response:**
```typescript
{
  asado: Asado
}
```

### PUT /api/asados/[id]
**Request:** Same as POST
**Response:** Same as POST

### DELETE /api/asados/[id]
**Response:**
```typescript
{
  success: boolean
}
```

## Business Rules

1. **Time for Arrival**: Time field determines "on time" vs "late"
   - On time: Within 10 minutes of time
   - Late: Between 10 minutes and 1 hour after time
   - No show: More than 1 hour after or didn't attend

2. **Host Assignment**: Host must be one of the 8 users

3. **Edit Anytime**: Past asados can be edited (trust-based)

4. **Delete Cascade**: When asado is deleted:
   - Delete all participations for that asado
   - Keep penalties linked to asado but mark asado as deleted

5. **Date Format**: Always store as YYYY-MM-DD for consistency

## UI/UX

### Create/Edit Form

**Fields:**
- Name (text input, required)
- Date (date picker, required)
- Time (time picker, required)
- Location (text input, required)
- Host (dropdown, required)
- Notes (textarea, optional)

**Actions:**
- Save button
- Cancel button (returns to list)
- Delete button (only on edit mode)

### List View
- Show upcoming asados first
- Display: name, date, location, host
- Click to edit
- Button: "Crear Asado"

### Helper Information
- "Último asador: Juan (hace 2 semanas)"
- "Sugerido: Pedro (hace 1 mes sin cocinar)"
- Not enforced, just suggestions

## Validation Rules

### Required Fields
- Name: Non-empty string
- Date: Valid date format
- Time: Valid time format (HH:MM)
- Location: Non-empty string
- Host: Valid user ID

### Optional Fields
- Notes: Any text or empty

### Edge Cases
- Date can be in the past (for recording old asados)
- Time is used for arrival calculations only
- Multiple asados can have same date
- Same user can host multiple consecutive asados

## Implementation Details

### Files
- `lib/types.ts` - Asado type definition
- `lib/db.ts` - Asado CRUD operations
- `app/api/asados/route.ts` - List & Create endpoints
- `app/api/asados/[id]/route.ts` - Get, Update, Delete endpoints
- `app/asados/nuevo/page.tsx` - Create asado page
- `app/asados/[id]/page.tsx` - Edit asado page
- `components/AsadoForm.tsx` - Asado form component

## Test Scenarios

### ✅ CRUD Operations
1. Create asado with all fields → Success
2. Create asado with optional notes empty → Success
3. Edit asado → Updates correctly
4. Delete asado → Removes asado and participations
5. List asados → Returns all asados sorted by date

### ✅ Validation
1. Submit without required field → Error
2. Invalid date format → Error
3. Invalid host ID → Error

### ✅ Integration
1. Create asado → Appears in list immediately
2. Edit asado → Changes reflected in rankings
3. Delete asado → Points recalculated

## Implementation Checklist
- [x] Asado type definition
- [x] Database CRUD operations
- [x] API endpoints (GET, POST, PUT, DELETE)
- [x] Create asado form
- [x] Edit asado form
- [x] Asado list view
- [x] Delete functionality
- [x] Form validation with Zod
- [x] Helper suggestions (last cook, etc.)
- [x] Tests for all operations

---

Last updated: 2026-01-18

