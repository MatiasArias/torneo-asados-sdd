# Feature: Penalties System

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: Users (01-users.md), Asados (02-asados.md) [optional link]
- **Blocks**: Rankings (06-rankings.md)

## Overview

Manual penalty system for tracking negative points due to bad behavior, absences, or end-of-year rules. Penalties are manually created and subtracted from user rankings.

## Specification

### Penalty Properties
- **ID**: Unique identifier (UUID)
- **User ID**: User receiving penalty (foreign key)
- **Points**: Negative points (-X, stored as negative number)
- **Reason**: Text explanation (string)
- **Date**: When penalty was applied (YYYY-MM-DD)
- **Asado ID**: Optional link to specific asado (can be null)

### Penalty Types

#### Manual Penalties (Created by Committee/Friends)
- **Comportamiento antideportivo**: -3 points
- **No hostear en el año**: -3 points (applied at year end)
- **Missed birthday**: -1 point (manual tracking)
- **Custom**: Any negative points with custom reason

#### Automatic Penalties (Future Enhancement)
- **Tercer ausencia consecutiva**: -1 point
- Currently tracked manually
- Could be automated in future version

## Data Model

### Vercel KV Structure

```json
{
  "penalties": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "userId": "1",
      "points": -3,
      "reason": "No hosteo en el año",
      "date": "2025-12-31",
      "asadoId": null
    },
    {
      "id": "750e8400-e29b-41d4-a716-446655440001",
      "userId": "2",
      "points": -1,
      "reason": "Tercer ausencia consecutiva",
      "date": "2025-06-15",
      "asadoId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

### TypeScript Definition

```typescript
interface Penalty {
  id: string;
  userId: string;
  points: number;        // Always negative
  reason: string;
  date: string;          // YYYY-MM-DD
  asadoId?: string;      // Optional link to asado
}
```

## Business Rules

### 1. Point Values
- **Always negative**: Points field must be ≤ 0
- **No maximum**: No cap on how negative it can be
- **Cumulative**: All penalties add up (subtract from total)

### 2. Creation
- **Manual only**: No automatic penalty creation in MVP
- **Trust-based**: Anyone can create penalty for anyone
- **No approval**: Immediate effect on rankings

### 3. Asado Linking
- **Optional**: Can link to specific asado or leave null
- **Not enforced**: Linked asado can be deleted without affecting penalty
- **For reference**: Helps remember context of penalty

### 4. Common Scenarios

**Year-End Penalties:**
- At end of tournament year, review who didn't host
- Manually create "-3 No hosteo en el año" penalty
- Apply on 2025-12-31 for tracking

**Absence Tracking:**
- Friends manually count consecutive absences
- At 3 consecutive absences, create "-1 Tercer ausencia consecutiva" penalty
- Link to the 3rd asado missed

**Birthday Penalties:**
- App shows "Próximo cumpleaños: Juan (15 de marzo)"
- If someone misses it, manually create "-1 Missed birthday" penalty
- Not automatically enforced

**Behavior Penalties:**
- For any unsportsmanlike conduct
- "-3 Comportamiento antideportivo"
- Decided by group, entered manually

### 5. Deletion
- Penalties can be deleted if entered by mistake
- No confirmation needed (trust-based)
- Immediately affects rankings

### 6. Editing
- No edit functionality in MVP
- To change: delete and recreate
- Simple approach for rare corrections

## API Contracts

### GET /api/penalties
**Response:**
```typescript
{
  penalties: Penalty[]
}
```

### POST /api/penalties
**Request:**
```typescript
{
  userId: string;
  points: number;      // Must be negative
  reason: string;
  date: string;        // YYYY-MM-DD
  asadoId?: string;    // Optional
}
```

**Response:**
```typescript
{
  penalty: Penalty
}
```

### DELETE /api/penalties/[id]
**Response:**
```typescript
{
  success: boolean
}
```

## UI/UX

### Penalties Page (`/penalties`)

**List View:**
- Table with columns: Date | User | Points | Reason | Asado | Actions
- Sorted by date (newest first)
- Delete button per row
- Button: "Agregar Penalty"

**Example:**
```
| Fecha      | Usuario | Puntos | Razón                     | Asado       | Acciones |
|------------|---------|--------|---------------------------|-------------|----------|
| 2025-12-31 | Juan    | -3     | No hosteo en el año       | -           | [Delete] |
| 2025-06-15 | Pedro   | -1     | Tercer ausencia consec.   | Asado #5    | [Delete] |
| 2025-03-20 | Carlos  | -3     | Comportamiento...         | Asado #2    | [Delete] |
```

### Create Penalty Form

**Modal or dedicated page:**

**Fields:**
- User (dropdown, required): Select from 8 users
- Points (number, required): Only negative values accepted
- Reason (textarea, required): Explanation
- Date (date picker, required): When penalty applied
- Asado (dropdown, optional): Link to asado

**Quick Presets (Buttons):**
- [-3] No hosteo en el año
- [-3] Comportamiento antideportivo
- [-1] Tercer ausencia consecutiva
- [-1] Birthday missed

Clicking preset auto-fills points and reason.

**Actions:**
- Save button
- Cancel button

### Helper Information

**On main page (Rankings or Dashboard):**
- "Próximo cumpleaños: Juan (15 de marzo)" - reminder
- "Usuarios sin hostear este año: Pedro, Carlos" - year-end check

### Integration with Rankings

Penalties appear in rankings table:

```
| # | Nombre | Puntos | Asados | Cocinados | Hosteos | Penalizaciones |
|---|--------|--------|--------|-----------|---------|----------------|
| 1 | Juan   | 45     | 8      | 3         | 2       | -3             |
| 2 | Pedro  | 38     | 7      | 2         | 1       | -1             |
```

## Validation Rules

### Required Fields
- User ID: Must be valid user
- Points: Must be number ≤ 0
- Reason: Non-empty string
- Date: Valid date format

### Optional Fields
- Asado ID: Can be null or valid asado ID

### Business Validation
- Points must be negative or zero
- If points = 0, show warning (probably a mistake)
- Date can be past or future (for planning year-end penalties)

## Edge Cases

### Q: Can penalties be positive?
**A:** No, validation prevents positive points. For positive adjustments, create asado or fix participation.

### Q: Penalty linked to deleted asado?
**A:** Allowed. Penalty keeps deleted asadoId for reference but still counts.

### Q: Multiple penalties same user/day?
**A:** Allowed. Each penalty independent.

### Q: Undo penalty?
**A:** Delete it. No edit/undo system in MVP.

### Q: Who decides penalties?
**A:** Group consensus. Trust-based, anyone can enter but friends decide together.

## Implementation Details

### Files
- `lib/types.ts` - Penalty type definition
- `lib/db.ts` - Penalty CRUD operations
- `app/api/penalties/route.ts` - List & Create endpoints
- `app/penalties/page.tsx` - Penalties list page
- Components: PenaltyForm, PenaltyList

### Database Operations

```typescript
// Create penalty
const penalty = await createPenalty({
  userId: "1",
  points: -3,
  reason: "No hosteo en el año",
  date: "2025-12-31",
  asadoId: null
});

// Get all penalties
const penalties = await getPenalties();

// Get penalties for specific user
const userPenalties = penalties.filter(p => p.userId === "1");

// Delete penalty
await deletePenalty(penaltyId);

// Calculate total penalties for user
const totalPenalties = userPenalties.reduce((sum, p) => sum + p.points, 0);
```

## Test Scenarios

### ✅ CRUD Operations
1. Create penalty with all fields → Success
2. Create penalty without asadoId → Success (null)
3. Create penalty with positive points → Error
4. Delete penalty → Removes from list
5. List penalties → Returns all sorted by date

### ✅ Validation
1. Submit without required field → Error
2. Submit with points = 0 → Warning
3. Submit with positive points → Error
4. Invalid user ID → Error

### ✅ Integration with Rankings
1. Create penalty → Immediately affects user's total points
2. User with penalties shows negative in Penalizaciones column
3. Delete penalty → Points recalculated
4. Multiple penalties for same user → All counted

### ✅ Edge Cases
1. Penalty linked to non-existent asado → Still valid
2. Penalty for user with no participations → Still appears in rankings
3. Multiple penalties same day → All shown
4. Future-dated penalty → Accepted (for planning)

### ✅ UI/UX
1. Quick preset buttons auto-fill form
2. Asado dropdown shows asado names
3. Delete confirmation (optional)
4. Sort by date works correctly

## Future Enhancements (Out of MVP Scope)

### Automatic Absence Tracking
- Count consecutive absences automatically
- Create penalty at 3rd consecutive absence
- Notification/warning system

### Birthday Reminders
- Automatic notification before birthdays
- Auto-create penalty if asado on birthday missed

### Penalty Appeals
- Voting system to approve/reject penalties
- Committee workflow
- History of changes

### Penalty Categories
- Tag penalties by type
- Filter by category
- Statistics per category

**MVP Status:** Manual penalties only, no automation

## Implementation Checklist
- [x] Penalty type definition
- [x] Database CRUD operations
- [x] API endpoints (GET, POST, DELETE)
- [x] Penalties list page
- [x] Create penalty form
- [x] Quick preset buttons
- [x] Asado linking (optional)
- [x] Validation (negative points)
- [x] Integration with rankings
- [x] Helper info (birthdays, non-hosts)
- [x] Tests for all operations

---

Last updated: 2026-01-18

