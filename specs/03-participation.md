# Feature: Participation & Roles

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: Users (01-users.md), Asados (02-asados.md)
- **Blocks**: Points (04-points.md), Rankings (06-rankings.md)

## Overview

Tracks who participated in each asado and what roles they performed. Each user can have multiple roles in a single asado.

## Specification

### Participation Properties
- **Asado ID**: Which asado (foreign key)
- **User ID**: Which user (foreign key)
- **Asador**: Whether user grilled (boolean)
- **Calificación Asado**: Rating of the grilled food (1-5 stars, required if asador)
- **Comprador**: Whether user bought the meat (boolean)
- **Compra Dividida**: Whether purchase was shared with others (boolean)
- **Asistió**: Whether user attended (boolean)
- **Llegó a Tiempo**: Arrived within 10 min of start time (boolean)
- **Llegó Tarde**: Arrived 10-60 min late (boolean)
- **Hosteo**: Whether user hosted (boolean)
- **Carne Especial**: Grilled special cuts (bicho/costillar) (boolean)
- **Points**: Calculated points for this participation (number)

## Data Model

### Vercel KV Structure

```json
{
  "participations": [
    {
      "asadoId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "1",
      "asador": true,
      "calificacionAsado": 4,
      "comprador": false,
      "compraDividida": false,
      "asistio": true,
      "llegoATiempo": true,
      "llegoTarde": false,
      "hosteo": false,
      "carneEspecial": true,
      "points": 9
    }
  ]
}
```

### TypeScript Definition

```typescript
interface Participation {
  asadoId: string;
  userId: string;
  asador: boolean;
  calificacionAsado?: number;  // 1-5, required if asador
  comprador: boolean;
  compraDividida: boolean;
  asistio: boolean;
  llegoATiempo: boolean;
  llegoTarde: boolean;
  hosteo: boolean;
  carneEspecial: boolean;
  points: number;              // Auto-calculated
}
```

## Business Rules

### Role Assignment

1. **Multiple Roles**: User can have multiple roles simultaneously
   - Can be asador + comprador + host + arrived on time
   - Points accumulate (subject to 10-point cap per asado)

2. **Asador Rules**:
   - Can have multiple asadores per asado (rare but allowed)
   - If asador = true, calificacionAsado is REQUIRED (1-5)
   - Rating decided by group after asado completes
   - Carne especial is bonus on top of asador points

3. **Comprador Rules**:
   - Can have multiple compradores per asado
   - If only 1 comprador: +3 points each
   - If multiple compradores: +1 point each (compraDividida = true)
   - System automatically sets compraDividida based on count

4. **Arrival Rules**:
   - **Mutually exclusive**: llegoATiempo OR llegoTarde OR neither
   - Implementation: Radio buttons, not checkboxes
   - On time: Within 10 min of asado.time
   - Late: 10-60 min after asado.time
   - Neither: Didn't attend or extremely late (>1 hour)

5. **Host Rules**:
   - Usually matches asado.hostId but not enforced
   - Can be different if someone else hosts
   - Points for hosting independent of being the designated host

6. **Attendance Rules**:
   - If asistio = false, most other checkboxes don't make sense
   - But not validated - trust-based system
   - Can mark someone as asador but didn't attend (e.g., prepared ahead)

### Validation Rules

1. **Required Fields**:
   - All boolean fields default to false
   - If asador = true, calificacionAsado must be 1-5

2. **Minimum Participants**:
   - At least 4 users with asistio = true
   - If < 4 attendees, ALL participants get 0 points
   - Warning shown in UI

3. **Rating Range**:
   - calificacionAsado must be integer 1-5
   - Represents quality of the grilled food

## API Contracts

### Included in Asado Endpoints

Participations are saved/loaded with asado data:

**POST/PUT /api/asados/[id]**
```typescript
{
  asado: { /* asado fields */ },
  participations: [
    {
      userId: string,
      asador: boolean,
      calificacionAsado?: number,
      // ... all participation fields
    }
  ]
}
```

**GET /api/asados/[id]**
```typescript
{
  asado: Asado,
  participations: Participation[]
}
```

## UI/UX

### Participants Table (in Asado Form)

For each of 8 users, show row with:

| User | Asador | ⭐ Rating | Comprador | Asistió | A tiempo | Tarde | Hosteo | Carne Especial | Compra Dividida | Points |
|------|--------|----------|-----------|---------|----------|-------|--------|----------------|----------------|--------|
| Juan | ☐      | [1-5]    | ☐         | ☐       | ⭕       | ⭕    | ☐      | ☐              | auto           | 0      |

**UI Elements:**
- Checkboxes for: asador, comprador, asistió, hosteo, carneEspecial
- Radio buttons for: llegoATiempo, llegoTarde
- Star rating (1-5) for calificación (only enabled if asador checked)
- Compra dividida: Auto-calculated, shown as badge
- Points: Live preview, calculated as user makes changes

**Interactions:**
- Check "Asador" → Rating field becomes required
- Check "Comprador" → System counts total compradores
  - If 1 comprador: compraDividida = false
  - If 2+ compradores: compraDividida = true for all
- Points column updates in real-time
- Warning if < 4 "Asistió" checked: "⚠️ Mínimo 4 participantes"

### Mobile View
- Collapse table to cards per user
- Stack fields vertically
- Maintain same validation rules

## Edge Cases

### Q: Can someone be asador + comprador?
**A:** Yes, all roles are independent

### Q: What if someone grills but doesn't attend?
**A:** Allowed (trust-based). E.g., prepared food the day before

### Q: Arrived on time AND late?
**A:** Not possible - radio buttons enforce mutual exclusion

### Q: Rating without being asador?
**A:** Not allowed - rating field disabled unless asador checked

### Q: Only 3 people attend?
**A:** Warning shown, asado can be saved, but everyone gets 0 points

## Implementation Details

### Files
- `lib/types.ts` - Participation type
- `lib/points.ts` - Points calculation logic
- `components/AsadoForm.tsx` - Participation table UI
- `app/api/asados/[id]/route.ts` - Save participations with asado

### Points Calculation Flow
1. User checks/unchecks participation options
2. Live preview calculates points per user
3. Validates minimum attendees (4)
4. On save, calculates final points
5. Stores points in participation record

### Compra Dividida Auto-Logic
```typescript
const compradores = participations.filter(p => p.comprador);
const compraDividida = compradores.length > 1;

compradores.forEach(p => {
  p.compraDividida = compraDividida;
  p.points += compraDividida ? 1 : 3; // Part of points calc
});
```

## Test Scenarios

### ✅ Role Assignment
1. Mark user as asador → Rating becomes required
2. Save without rating → Validation error
3. Mark 3 users as compradores → All get compraDividida = true
4. Mark 1 user as comprador → compraDividida = false

### ✅ Arrival Times
1. Mark "A tiempo" → "Tarde" disabled
2. Mark "Tarde" → "A tiempo" disabled
3. Can deselect both → Valid state

### ✅ Minimum Attendees
1. Mark 3 users as asistió → Warning shown
2. Save anyway → All get 0 points
3. Mark 4 users → Normal points calculation

### ✅ Multiple Roles
1. User as asador + comprador + host + on time
2. Points accumulate correctly
3. Cap at 10 points if exceeds

### ✅ Integration
1. Save participations with asado → Stored correctly
2. Load asado → Participations populate form
3. Edit participation → Rankings update

## Implementation Checklist
- [x] Participation type definition
- [x] Participation table UI component
- [x] Live points preview
- [x] Asador → Rating validation
- [x] Compra dividida auto-calculation
- [x] Arrival time radio buttons
- [x] Minimum attendees warning
- [x] Save/load with asado
- [x] Mobile responsive design
- [x] Tests for all rules

---

Last updated: 2026-01-18

