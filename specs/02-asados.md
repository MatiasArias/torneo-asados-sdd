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
- ✅ Delete asado (with access code validation)
- ✅ View asado details
- ✅ List all asados

### Permissions
- **Access Code Protected**: Creating, editing, and deleting asados requires a validation code (20182024)
- Code is requested via modal before saving or deleting
- Trust-based after authentication

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

1. **Access Code Validation**: 
   - Before creating or editing an asado, user must enter access code
   - Code modal appears automatically when attempting to save
   - Code: 20182024
   - Access is granted for single operation, then resets

2. **Time for Arrival**: Time field determines "on time" vs "late"
   - On time: Within 10 minutes of time
   - Late: Between 10 minutes and 1 hour after time
   - No show: More than 1 hour after or didn't attend

3. **Host Assignment**: Host must be one of the 8 users

4. **Edit Anytime**: Past asados can be edited (after code validation)

5. **Delete Cascade**: When asado is deleted (requires access code):
   - Requires browser confirmation dialog
   - Requires access code validation
   - Delete all participations for that asado
   - **Recalculate all points** for all users (critical for rankings)
   - Keep penalties linked to asado but mark asado as deleted
   - Redirects to home page after successful deletion

6. **Date Format**: Always store as YYYY-MM-DD for consistency

7. **Auto-fill Date**: When creating new asado, date defaults to today (editable)

## UI/UX

### Create/Edit Form

**Fields:**
- Name (text input, required)
- Date (auto, suggested as today, but editable with date picker, required)
- Time (time picker, required)
- Location (text input, required)
- Host (dropdown, required)
- Notes (textarea, optional)

**Actions:**
- Save button (requires access code)
- Cancel button (returns to list)
- Delete button (top right, only on edit mode, requires access code)
  - Red button with trash icon
  - Requires confirmation dialog + access code
  - Located next to "← Volver al inicio" link

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
- `components/AccessCodeModal.tsx` - Access code validation modal

### Access Code Flow

**For Creating/Editing:**
1. User fills asado form completely
2. User clicks "Crear Asado" or "Actualizar Asado"
3. System checks if access has been granted in this session
4. If not granted, modal appears requesting code
5. User enters code (20182024)
6. If correct:
   - Access granted
   - Modal closes
   - Form submits automatically
   - Access resets after successful save
7. If incorrect:
   - Error message displayed
   - Modal shakes animation
   - Input clears
   - User can retry or cancel

**For Deleting:**
1. User clicks trash icon button (top right of edit page)
2. Browser confirmation dialog appears: "¿Estás seguro que quieres eliminar este asado?"
3. If user confirms:
   - System checks if access granted
   - If not, modal appears requesting code
   - User enters code (20182024)
4. If correct:
   - Asado deleted
   - All participations deleted
   - Redirects to home page
   - Access resets
5. If incorrect:
   - Error message displayed
   - Modal shakes
   - Asado preserved

## Test Scenarios

### ✅ CRUD Operations
1. Create asado with all fields → Requires code → Success
2. Create asado with optional notes empty → Requires code → Success
3. Edit asado → Requires code → Updates correctly
4. Delete asado via trash button → Confirmation + code → Removes asado and participations
5. List asados → Returns all asados sorted by date

### ✅ Access Code Validation
1. Attempt to create without code → Modal appears
2. Enter wrong code → Error, shake animation, retry
3. Enter correct code → Asado created
4. Attempt to delete without code → Modal appears after confirmation
5. Access resets after each operation

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

