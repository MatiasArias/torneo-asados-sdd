# Feature: Rankings & Leaderboard

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: Users (01-users.md), Points (04-points.md), Penalties (05-penalties.md)
- **Blocks**: None (final feature)

## Overview

Real-time leaderboard showing tournament standings. Calculates each user's total points from all participations and penalties, with tie-breaking rules.

## Specification

### Ranking Display Columns

| Column | Description | Calculation |
|--------|-------------|-------------|
| **Posición** | Rank (#) | Based on total points + tie-breakers |
| **Nombre** | User name | From users table |
| **Puntos** | Total points | Sum of all participation.points + penalties |
| **Asados** | Asados attended | Count of participations with asistio = true |
| **Cocinados** | Times cooked | Count of participations with asador = true |
| **Hosteos** | Times hosted | Count of participations with hosteo = true |
| **Penalizaciones** | Penalty points | Sum of all penalty.points (negative) |

### Ranking Calculation

```typescript
interface RankingEntry {
  position: number;
  user: User;
  totalPoints: number;
  asadosAttended: number;
  asadosCooked: number;
  timesHosted: number;
  penaltyPoints: number;
}

function calculateRankings(
  users: User[],
  participations: Participation[],
  penalties: Penalty[]
): RankingEntry[] {
  const entries = users.map(user => {
    // Get all participations for this user
    const userParticipations = participations.filter(p => p.userId === user.id);
    
    // Sum participation points
    const participationPoints = userParticipations.reduce(
      (sum, p) => sum + p.points, 0
    );
    
    // Sum penalty points
    const userPenalties = penalties.filter(p => p.userId === user.id);
    const penaltyPoints = userPenalties.reduce(
      (sum, p) => sum + p.points, 0
    );
    
    // Calculate stats
    return {
      user,
      totalPoints: participationPoints + penaltyPoints,
      asadosAttended: userParticipations.filter(p => p.asistio).length,
      asadosCooked: userParticipations.filter(p => p.asador).length,
      timesHosted: userParticipations.filter(p => p.hosteo).length,
      penaltyPoints,
      position: 0 // Assigned after sorting
    };
  });
  
  // Sort with tie-breakers
  entries.sort((a, b) => {
    // 1. Total points (descending)
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    
    // 2. More asados cooked
    if (b.asadosCooked !== a.asadosCooked) {
      return b.asadosCooked - a.asadosCooked;
    }
    
    // 3. More times hosted
    if (b.timesHosted !== a.timesHosted) {
      return b.timesHosted - a.timesHosted;
    }
    
    // 4. Alphabetical by name
    return a.user.name.localeCompare(b.user.name);
  });
  
  // Assign positions
  entries.forEach((entry, index) => {
    entry.position = index + 1;
  });
  
  return entries;
}
```

## Business Rules

### 1. Tie-Breaking Order

When two or more users have the same total points:

1. **More asados cooked**: User who cooked more asados ranks higher
2. **More times hosted**: User who hosted more ranks higher  
3. **Alphabetical**: Sort by name (A-Z)

**No playoff system**: Rankings determine winner, no extra competition needed.

### 2. Point Calculation

```typescript
Total Points = (Sum of all participation points) + (Sum of all penalty points)

Example:
  Juan:
    - Asado 1: 8 points
    - Asado 2: 5 points
    - Asado 3: 10 points
    - Penalty 1: -3 points
    - Penalty 2: -1 points
  Total = 8 + 5 + 10 + (-3) + (-1) = 19 points
```

### 3. Real-Time Updates

Rankings recalculate on every page load:
- Load all users
- Load all participations  
- Load all penalties
- Calculate rankings
- Display results

**No caching**: Simple approach for MVP with small dataset (8 users).

### 4. Display All Users

- Always show all 8 users, even if they have 0 points
- Users without participations appear at bottom (0 points)
- Shows full picture of tournament standings

## UI/UX

### Rankings Table

**Main Page (`/` - Home):**

```
🥩 Torneo de Asados - Ranking 2025

[Crear Asado] [Ver Penalizaciones]

┌────┬─────────┬────────┬────────┬───────────┬─────────┬────────────────┐
│ #  │ Nombre  │ Puntos │ Asados │ Cocinados │ Hosteos │ Penalizaciones │
├────┼─────────┼────────┼────────┼───────────┼─────────┼────────────────┤
│ 1  │ Juan    │   45   │   8    │     3     │    2    │      -3        │
│ 2  │ Pedro   │   38   │   7    │     2     │    1    │      -1        │
│ 3  │ Carlos  │   35   │   8    │     2     │    2    │       0        │
│ 4  │ Luis    │   32   │   6    │     1     │    1    │      -3        │
│ 5  │ Diego   │   28   │   7    │     1     │    1    │       0        │
│ 6  │ Matias  │   22   │   5    │     1     │    0    │      -3        │
│ 7  │ Santi   │   15   │   4    │     0     │    1    │       0        │
│ 8  │ Fede    │    8   │   3    │     0     │    0    │      -1        │
└────┴─────────┴────────┴────────┴───────────┴─────────┴────────────────┘
```

### Visual Highlights

1. **Position Badges**:
   - 🥇 Gold for #1
   - 🥈 Silver for #2
   - 🥉 Bronze for #3

2. **Point Styling**:
   - Positive points: Green text
   - Penalties: Red text
   - Zero: Gray text

3. **Leader Callout**:
   - "🏆 Líder actual: Juan (45 puntos)"
   - Shows above or below table

### Quick Stats (Above Table)

```
📊 Estadísticas del Torneo

Total Asados: 12      |  Participación Promedio: 6.5
Mejor Asador: Juan (3 asados)  |  Mejor Anfitrión: Juan (2 veces)
```

### Mobile View

**Responsive cards:**

```
┌─────────────────────┐
│ 🥇 #1 - Juan        │
│ 45 puntos           │
│                     │
│ Asados: 8           │
│ Cocinados: 3        │
│ Hosteos: 2          │
│ Penalizaciones: -3  │
└─────────────────────┘

┌─────────────────────┐
│ 🥈 #2 - Pedro       │
│ 38 puntos           │
│ ...                 │
└─────────────────────┘
```

### Empty State

If no asados yet:

```
🥩 Torneo de Asados

No hay asados registrados todavía.
¡Crea el primer asado para empezar el torneo!

[Crear Primer Asado]
```

Still show users with 0 points each.

## API Contracts

### GET /api/rankings

**Response:**
```typescript
{
  rankings: [
    {
      position: 1,
      user: {
        id: "1",
        name: "Juan",
        birthday: "03-15"
      },
      totalPoints: 45,
      asadosAttended: 8,
      asadosCooked: 3,
      timesHosted: 2,
      penaltyPoints: -3
    }
    // ... more entries
  ],
  stats: {
    totalAsados: 12,
    averageAttendance: 6.5,
    topCook: { name: "Juan", count: 3 },
    topHost: { name: "Juan", count: 2 }
  }
}
```

### Calculation Endpoint (Internal)

Could be same as GET /rankings or separate:

```typescript
// lib/rankings.ts
export function calculateRankings(
  users: User[],
  participations: Participation[],
  penalties: Penalty[]
): RankingEntry[];
```

## Edge Cases

### Q: User with 0 participations?
**A:** Shows in rankings with 0 points, at bottom (or ordered alphabetically with other 0-point users).

### Q: Tied on all tie-breakers?
**A:** Alphabetical order decides. Both show same stats but different positions.

### Q: Negative total points?
**A:** Possible if penalties > participation points. Shows negative number, ranks at bottom.

### Q: User never attended but has penalty?
**A:** Total points = penalty points (negative). Shows in rankings at bottom.

### Q: Mid-year rankings?
**A:** Always shows current standings. No history/snapshots in MVP.

## Test Scenarios

### ✅ Basic Ranking

**Given:**
- Juan: 25 points
- Pedro: 30 points
- Carlos: 20 points

**Expected:**
1. Pedro (30)
2. Juan (25)
3. Carlos (20)

### ✅ Tie-Breaking on Points

**Given:**
- Juan: 30 points, 3 cooked, 2 hosted
- Pedro: 30 points, 2 cooked, 1 hosted
- Carlos: 30 points, 2 cooked, 1 hosted

**Expected:**
1. Juan (more cooked)
2. Carlos (alphabetical before Pedro)
3. Pedro

### ✅ Tie-Breaking on Hosted

**Given:**
- Juan: 30 points, 2 cooked, 3 hosted
- Pedro: 30 points, 2 cooked, 1 hosted

**Expected:**
1. Juan (more hosted)
2. Pedro

### ✅ Penalties Affect Ranking

**Given:**
- Juan: 30 participation points, -5 penalty = 25 total
- Pedro: 20 participation points, 0 penalty = 20 total

**Expected:**
1. Juan (25)
2. Pedro (20)

### ✅ All Users Show

**Given:**
- 8 users, only 5 have participated

**Expected:**
- All 8 users in rankings
- 5 with positive/negative points
- 3 with 0 points at bottom

### ✅ Real-Time Update

**Scenario:**
1. Load rankings → Juan is #1
2. Create new asado with Pedro getting 10 points
3. Reload rankings → Pedro moves up
4. Create penalty for Pedro (-5)
5. Reload rankings → Pedro moves down

## Implementation Details

### Files
- `lib/rankings.ts` - Ranking calculation logic
- `lib/types.ts` - RankingEntry type
- `app/page.tsx` - Home page with rankings table
- `app/api/rankings/route.ts` - Rankings API endpoint (optional)
- `components/RankingsTable.tsx` - Rankings table component

### Key Functions

```typescript
// Calculate rankings from raw data
export function calculateRankings(
  users: User[],
  participations: Participation[],
  penalties: Penalty[]
): RankingEntry[];

// Calculate tournament stats
export function calculateStats(
  asados: Asado[],
  participations: Participation[]
): TournamentStats;

// Get user's total points
export function getUserTotalPoints(
  userId: string,
  participations: Participation[],
  penalties: Penalty[]
): number;

// Tie-breaking comparator
function tieBreaker(a: RankingEntry, b: RankingEntry): number;
```

### Performance Considerations

**MVP with 8 users:**
- Calculate on every request (no caching)
- Simple O(n) operations
- Fast enough for small dataset

**Future optimization (if needed):**
- Cache rankings, invalidate on change
- Server-side caching with TTL
- Incremental updates instead of full recalc

## Implementation Checklist
- [x] Ranking calculation logic
- [x] Tie-breaking implementation
- [x] Rankings API endpoint
- [x] Rankings table component
- [x] Position badges (#1, #2, #3)
- [x] Quick stats calculation
- [x] Mobile responsive view
- [x] Empty state handling
- [x] Real-time updates
- [x] Tests for all tie-breaking scenarios
- [x] Integration tests with full data

---

Last updated: 2026-01-18

