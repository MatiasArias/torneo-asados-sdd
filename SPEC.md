# Torneo de Asadores – Specification (MVP)

## 0. Context
- **8 users total** (fixed group of friends)
- Tournament per year (2025)
- Mobile-first web app
- Trust-based (no complex permissions)
- Must work on Vercel free plan

---

## 1. Goal
Simple web app to track asados, assign roles, calculate points automatically, and show rankings.

---

## 2. Core Features (MVP Only)

### 2.1 Users
- Fixed list of 8 users (hardcoded or simple JSON)
- Fields:
  - ID
  - Name
  - Birthday (MM-DD) - for birthday penalty
- No registration, no auth (trust-based access)

### 2.2 Asados
- Create, edit, delete asados
- Fields:
  - Name
  - Date
  - Time (for calculating arrival)
  - Location
  - Host (user)
  - Notes (optional)
- Anyone can edit any asado (friends only)

### 2.3 Participation
For each asado, assign participants and their roles:
- **Asador** (checkbox) + **Calificación del asado** (1-5 stars)
- **Comprador** (checkbox) (Puede ser 1 o varios. 3 puntos si compra solo, 1 punto si compra compartido)
- **Asistió** (checkbox)
- **Llegó a tiempo** (within 10 min)
- **Llegó tarde** (after 10 min but before 1 hour)
- **Hosteo** (checkbox)
- **Carne especial** (bicho/costillar, checkbox)

### 2.4 Points Calculation (Automatic)
**Base points per asado:**
- **Asar: +3 fijos + (calificación de 1-5) = 4 a 8 puntos totales**
  - Calificación la decide el grupo al finalizar el asado
  - Input: 1-5 estrellas (required si hubo asador)
- Carne especial: +1 (bonus sobre puntos de asar)
- Comprar solo: +3 / Comprar compartido: +1 por persona
- Asistir: +1
- Llegar a tiempo: +1
- Llegar tarde: +0.5
- Hostear: +3

**Conditions:**
- Minimum 4 attendees or asado = 0 points for everyone
- Max 10 points per user per asado
- **Calificación del asado es obligatoria si hay asador** (1-5)

**Points calculated and saved on each asado save.**

### 2.5 Penalties (Manual)
Simple penalty system:
- Add penalty to user: -X points
- Reason (text)
- Date
- Linked to asado (optional)

Common penalties (manual):
- Comportamiento antideportivo: -3
- No hostear en el año: -3 (Fin de toreneo)

Common penalties (automatic):
- Tercer ausencia consecutiva: -1

### 2.6 Rankings
Single page showing:
- Position (#)
- Name
- Total points
- Asados attended
- Asados cooked
- Times hosted
- Penalties

Sorted by total points (descending).

---

## 3. Data Model (Simple)

### 3.1 Vercel KV Structure
Single key: `torneo_2025`

```json
{
  "users": [
    {
      "id": "1",
      "name": "Juan",
      "birthday": "03-15"
    }
  ],
  "asados": [
    {
      "id": "uuid",
      "name": "Asado de Juan",
      "date": "2025-01-20",
      "time": "20:00",
      "location": "Casa de Juan",
      "hostId": "1",
      "notes": ""
    }
  ],
  "participations": [
    {
      "asadoId": "uuid",
      "userId": "1",
      "asador": true,
      "calificacionAsado": 4,
      "comprador": false,
      "asistio": true,
      "llegoATiempo": true,
      "llegoTarde": false,
      "hosteo": false,
      "carneEspecial": true,
      "compraDividida": false,
      "points": 9
    }
  ],
  "penalties": [
    {
      "id": "uuid",
      "userId": "1",
      "points": -3,
      "reason": "No hosteo en el año",
      "date": "2025-12-31",
      "asadoId": null
    }
  ]
}
```

---

## 4. UI Pages (3 pages only)

### 4.1 Home / Rankings
- Show full ranking table
- Button: "Crear Asado"
- Quick stats: total asados, current leader

### 4.2 Create/Edit Asado
**Form:**
- Name (text)
- Date (date picker)
- Time (time picker)
- Location (text)
- Host (dropdown)
- Notes (textarea)

**Participants table:**
For each of 8 users, checkboxes for:
- Asador | Calificación (1-5 stars) | Comprador | Asistió | Llegó a tiempo | Llegó tarde | Hosteo | Carne especial | Compra dividida

**Notes:**
- Si usuario es asador, calificación es obligatoria (1-5)
- Calificación decide el grupo al finalizar el asado
- Puede haber múltiples compradores (si es 1 solo: +3 pts c/u, si son varios: +1 pt c/u)

**Bottom:**
- Points preview (calculated live)
- Save button
- Cancel button

### 4.3 Penalties
- List of all penalties
- Button: "Agregar Penalty"
- Form: User (dropdown), Points (number), Reason (text), Date (date picker)

---

## 5. Simplified Rules

### 5.1 Cook Rotation
**No automatic enforcement.** Just show helper:
- "Último asador: Juan (hace 2 semanas)"
- "Sugerido: Pedro (hace 1 mes sin cocinar)"

Users decide manually who cooks.

### 5.2 Birthday Penalties
**Manual only.** App shows:
- "Próximo cumpleaños: Juan (15 de marzo)"
- If someone misses it, manually add -1 penalty

### 5.3 Absence Tracking
**Manual only.** No automatic counting.
- If someone reaches 3 consecutive absences, manually add -1 penalty

### 5.4 Year-End
**Manual only.** 
- Winner: Highest points (obvious from ranking)
- Prize: Group decides, no tracking needed
- Last place: Mark manually if needed

### 5.5 Tie-breaking
If 2 users have same points, rank by:
1. More asados cooked
2. More times hosted
3. Alphabetical (simple)

No playoff system. Friends can decide outside the app.

---

## 6. Technology Stack (Minimal)

### 6.1 Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** (no component library)
- **React Hook Form** + **Zod** (forms)

### 6.2 Backend
- **Vercel KV** (single JSON key)
- API routes in Next.js

### 6.3 Auth
**Option 1 (recommended)**: No auth, shared URL
- Only friends know the URL
- Anyone can edit

**Option 2**: Single password
- One password in env variable
- Simple middleware check

Start with Option 1.

### 6.4 Deployment
- **Vercel** (free plan)
- Deploy on every push to main

---

## 7. Development Plan (Single Phase)

### Phase 1: MVP (All features)
1. Setup Next.js + Tailwind + Vercel KV
2. Create data structure in KV
3. Rankings page (read-only)
4. Create/edit asado form
5. Points calculation logic
6. Penalties CRUD
7. Deploy

**Time estimate: 1-2 days of focused work**

---

## 8. What We're NOT Building (Out of Scope)

❌ Committee/roles/permissions  
❌ Multi-state validation workflow  
❌ Automatic absence tracking  
❌ Playoff system with voting  
❌ Expense tracking (friends split offline)  
❌ Cook rotation enforcement  
❌ Alternative meetup tracking  
❌ User profiles/history pages  
❌ Charts/graphs  
❌ Photos  
❌ Notifications  
❌ Mobile app  
❌ Multi-year history  

**Just the essentials: create asados, assign roles, see ranking.**

---

## 9. Edge Cases (Simplified Handling)

### 9.1 Less than 4 participants
- App shows warning: "Necesitas mínimo 4 participantes"
- Points = 0 for everyone
- Asado still saved for records

### 9.2 Can someone be asador + comprador?
- Yes, checkboxes independent
- Points add up (subject to 10-point cap)

### 9.3 Arrived on time AND late?
- UI: Radio buttons (one or other or neither)
- Not checkboxes

### 9.4 Edit past asados?
- Yes, anyone can edit anytime
- Trust-based system

### 9.5 Delete asados?
- Yes, anyone can delete
- No confirmation needed (friends only)

---

## 10. Testing Scenarios

### Basic happy path:
1. Create asado with 5 participants
2. Juan: asador (calificación 4) + carne especial + asistió + a tiempo = 3+4+1+1+1 = 10 points (capped) ✓
3. Pedro: comprador (solo) + asistió + tarde = 3+1+0.5 = 4.5 points ✓
4. Check ranking shows correct totals ✓

### Cap scenario:
1. Juan: asador (5★) + carne especial + comprador (solo) + hosteo + asistió + a tiempo
2. Calculation: (3+5)+1+3+3+1+1 = 17 → capped at 10 ✓

### Rating scenario:
1. Juan asa con calificación 5★: 3+5 = 8 points (solo por asar) ✓
2. Pedro asa con calificación 1★: 3+1 = 4 points (solo por asar) ✓
3. Carlos asa con calificación 3★ + carne especial: 3+3+1 = 7 points ✓

### Minimum participants:
1. Create asado with only 3 participants
2. All get 0 points ✓
3. Warning shown ✓

---

## 11. Deployment Checklist

### Environment Variables
```bash
KV_URL=xxx
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx
KV_REST_API_READ_ONLY_TOKEN=xxx
```

### Initial Data
Seed with 8 users (hardcoded or manual JSON):
```json
{
  "users": [
    {"id": "1", "name": "Juan", "birthday": "03-15"},
    {"id": "2", "name": "Pedro", "birthday": "05-20"},
    {"id": "3", "name": "Carlos", "birthday": "08-10"},
    {"id": "4", "name": "Luis", "birthday": "11-05"},
    {"id": "5", "name": "Diego", "birthday": "02-14"},
    {"id": "6", "name": "Matias", "birthday": "07-22"},
    {"id": "7", "name": "Santi", "birthday": "09-30"},
    {"id": "8", "name": "Fede", "birthday": "12-12"}
  ],
  "asados": [],
  "participations": [],
  "penalties": []
}
```

---

## 12. Success Criteria

✅ 8 friends can access the app  
✅ Create asado in < 2 minutes  
✅ Points calculate correctly automatically  
✅ Rankings always up-to-date  
✅ Works on mobile phones  
✅ No bugs, simple and fast  

**Goal: Spend more time having asados than managing the app.**

---

**END OF MVP SPEC**

Last updated: 2026-01-18
