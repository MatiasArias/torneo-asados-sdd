# Feature: Points Calculation System

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: Users (01-users.md), Asados (02-asados.md), Participation (03-participation.md)
- **Blocks**: Rankings (06-rankings.md)

## Overview

Automatic points calculation system based on participation and roles in each asado. Points are calculated on save and stored with each participation record.

## Specification

### Base Points Per Asado

| Action | Points | Conditions |
|--------|--------|------------|
| **Asar** | 3 + calificación (1-5) | Total: 4-8 points. Rating required |
| **Carne especial** | +1 | Bonus on top of asar points |
| **Comprar solo** | +3 | Only 1 comprador in the asado |
| **Comprar compartido** | +1 | 2+ compradores in the asado |
| **Asistir** | +1 | Simply attending |
| **Llegar a tiempo** | +1 | Within 10 min of start time |
| **Llegar tarde** | +0.5 | 10-60 min after start time |
| **Hostear** | +3 | Hosting the asado |

### Point Caps and Limits

1. **Maximum per asado**: 10 points per user per asado
2. **Minimum attendees**: At least 4 participants must have `asistio = true`
   - If < 4 attendees: **Everyone gets 0 points** for that asado

### Calculation Formula

```typescript
function calculatePoints(participation: Participation, asado: Asado, allParticipations: Participation[]): number {
  let points = 0;
  
  // Check minimum attendees
  const attendees = allParticipations.filter(p => p.asistio).length;
  if (attendees < 4) {
    return 0; // Everyone gets 0 if < 4 attendees
  }
  
  // Asador points
  if (participation.asador) {
    points += 3 + (participation.calificacionAsado || 0); // 4-8 points
    
    // Carne especial bonus
    if (participation.carneEspecial) {
      points += 1;
    }
  }
  
  // Comprador points
  if (participation.comprador) {
    const totalCompradores = allParticipations.filter(p => p.comprador).length;
    points += totalCompradores === 1 ? 3 : 1;
  }
  
  // Attendance
  if (participation.asistio) {
    points += 1;
  }
  
  // Arrival time (mutually exclusive)
  if (participation.llegoATiempo) {
    points += 1;
  } else if (participation.llegoTarde) {
    points += 0.5;
  }
  
  // Hosting
  if (participation.hosteo) {
    points += 3;
  }
  
  // Apply cap
  return Math.min(points, 10);
}
```

## Business Rules

### 1. Calculation Timing
- **Calculated on save**: Points computed when asado is saved/updated
- **Stored with participation**: Points stored in participation record
- **Recalculated on edit**: If asado edited, all points recalculated

### 2. Rating System
- **Required if asador**: calificación (1-5) required when user is marked as asador
- **Group decision**: Rating decided by group after asado completes
- **Impact**: Directly adds to base 3 points (total 4-8 for asador)

### 3. Comprador Logic
- **Auto-detect shared**: System counts total compradores per asado
- **Single buyer**: If 1 comprador → 3 points
- **Multiple buyers**: If 2+ compradores → 1 point each
- **Sets flag**: Automatically sets `compraDividida` flag

### 4. Special Scenarios

**Maximum possible points (before cap):**
- Asador (3) + Perfect rating (5) + Carne especial (1) + Comprador solo (3) + Hosteo (3) + Asistió (1) + A tiempo (1) = **17 points**
- **Capped at 10 points**

**Common scenarios:**
- Just attending + on time: 1 + 1 = **2 points**
- Asador good rating (4★): 3 + 4 = **7 points**
- Host + attend + on time: 3 + 1 + 1 = **5 points**
- Bought alone + attend + late: 3 + 1 + 0.5 = **4.5 points**

## API Integration

### Points Calculation Flow

1. **User submits asado form** with participations
2. **Backend receives** asado + participations data
3. **For each participation**:
   - Calculate points based on rules
   - Check minimum attendees
   - Apply cap
   - Store points in participation.points
4. **Save to database**
5. **Return** updated asado with calculated points

### API Response Includes Points

```typescript
// POST/PUT /api/asados/[id]
{
  asado: Asado,
  participations: [
    {
      userId: "1",
      asador: true,
      calificacionAsado: 4,
      // ... other fields
      points: 9  // ← Calculated points
    }
  ]
}
```

## UI/UX

### Live Points Preview

**In Asado Form:**
- Rightmost column shows points per user
- Updates in real-time as user checks/unchecks options
- Shows warning if would exceed 10 (but caps at 10)
- Shows 0 if < 4 attendees

**Visual Feedback:**
```
| User   | [roles checkboxes] | Points |
|--------|-------------------|--------|
| Juan   | [✓ multiple]      | 10 ⚠️  | ← Capped
| Pedro  | [✓ some]          | 4.5    |
| Carlos | [ ]               | 0      |

⚠️ Mínimo 4 participantes requeridos (actual: 3) ← Warning if < 4
```

### Points Breakdown (Optional Tooltip)

Hover on points → Show breakdown:
```
Asador: 3 + 4★ = 7
Carne especial: +1
Asistió: +1
A tiempo: +1
Total: 10 (capped)
```

## Validation Rules

### Pre-save Validation
1. If asador = true → calificación must be 1-5
2. Rating must be integer, not decimal
3. All boolean fields must be true/false

### Post-calculation Validation
1. Points must be ≥ 0
2. Points must be ≤ 10
3. If < 4 attendees, all points must be 0

### Warning (Not Blocking)
- If < 4 attendees, show warning but allow save
- Points will be 0 for everyone

## Test Scenarios

### ✅ Basic Point Calculations

**Test Case 1: Simple Attendance**
```typescript
Input:
  - asistio: true
  - llegoATiempo: true
  - (4+ attendees)
Expected: 2 points
```

**Test Case 2: Asador with Rating**
```typescript
Input:
  - asador: true
  - calificacionAsado: 4
  - asistio: true
  - llegoATiempo: true
  - (4+ attendees)
Expected: 3 + 4 + 1 + 1 = 9 points
```

**Test Case 3: Maximum Points (Capped)**
```typescript
Input:
  - asador: true, calificacionAsado: 5
  - carneEspecial: true
  - comprador: true (solo)
  - hosteo: true
  - asistio: true
  - llegoATiempo: true
  - (4+ attendees)
Calculation: (3+5) + 1 + 3 + 3 + 1 + 1 = 17
Expected: 10 points (capped)
```

**Test Case 4: Multiple Compradores**
```typescript
Given: 3 users marked as comprador
Expected: Each comprador gets +1 point (not +3)
```

**Test Case 5: Minimum Attendees Not Met**
```typescript
Given: Only 3 users with asistio = true
Expected: All participants get 0 points, regardless of roles
```

**Test Case 6: Late Arrival**
```typescript
Input:
  - asistio: true
  - llegoTarde: true
  - (4+ attendees)
Expected: 1 + 0.5 = 1.5 points
```

**Test Case 7: Carne Especial Without Asador**
```typescript
Input:
  - asador: false
  - carneEspecial: true
  - asistio: true
Expected: 1 point (carne especial only counts if asador)
```

### ✅ Edge Cases

**Test Case 8: No Roles, Just Attendance**
```typescript
Input:
  - asistio: true
  - (all other fields false)
  - (4+ attendees)
Expected: 1 point
```

**Test Case 9: Multiple Asadores**
```typescript
Given: 2 users marked as asador with ratings 5 and 3
Expected: 
  - User 1: 3 + 5 = 8 points (+ other roles)
  - User 2: 3 + 3 = 6 points (+ other roles)
```

**Test Case 10: Host But Not Hosteo Checkbox**
```typescript
Given: asado.hostId = "1", but participation.hosteo = false
Expected: User "1" gets 0 hosteo points (only checkbox matters)
```

## Implementation Details

### Files
- `lib/points.ts` - Core calculation logic
- `lib/types.ts` - Participation type with points field
- `components/AsadoForm.tsx` - Live preview calculation
- `app/api/asados/[id]/route.ts` - Server-side calculation

### Key Functions

```typescript
// Calculate points for single participation
export function calculateParticipationPoints(
  participation: Participation,
  asado: Asado,
  allParticipations: Participation[]
): number;

// Calculate points for all participations in an asado
export function calculateAsadoPoints(
  asado: Asado,
  participations: Participation[]
): Participation[];

// Check if minimum attendees met
export function hasMinimumAttendees(
  participations: Participation[]
): boolean;

// Get points breakdown for display
export function getPointsBreakdown(
  participation: Participation,
  allParticipations: Participation[]
): PointsBreakdown;
```

## Implementation Checklist
- [x] Core calculation function
- [x] Minimum attendees check
- [x] Point cap enforcement
- [x] Comprador shared/solo logic
- [x] Asador rating validation
- [x] Live preview in UI
- [x] Points breakdown tooltip
- [x] Server-side calculation
- [x] Store points with participation
- [x] Comprehensive test suite
- [x] Edge case handling

---

Last updated: 2026-01-18

