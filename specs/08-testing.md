# Feature: Testing Scenarios & Quality Assurance

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: All features
- **Blocks**: None (validation layer)

## Overview

Comprehensive testing scenarios to ensure the application works correctly. Covers happy paths, edge cases, and integration scenarios.

## Test Categories

### 1. Points Calculation Tests

See `04-points.md` for detailed test scenarios.

**Key Tests:**
- Simple attendance (2 pts)
- Asador with rating (4-8 pts)
- Maximum points capped at 10
- Multiple compradores logic
- Minimum attendees (< 4 = 0 pts)
- Late arrival (0.5 pts)

### 2. Ranking Tests

See `06-rankings.md` for detailed test scenarios.

**Key Tests:**
- Sort by total points
- Tie-breaking (cooked > hosted > alphabetical)
- Penalties affect ranking
- All users shown (even with 0 points)
- Real-time updates

### 3. Integration Tests

**Happy Path:**
1. Create asado with 5 participants ✓
2. Juan: asador (4★) + carne especial + asistió + a tiempo = 10 pts ✓
3. Pedro: comprador (solo) + asistió + tarde = 4.5 pts ✓
4. Check ranking shows correct totals ✓
5. Create penalty for Juan (-3) ✓
6. Ranking updates: Juan still #1 but with 7 pts ✓

**Multiple Asados:**
1. Create asado #1 → Juan gets 8 pts
2. Create asado #2 → Pedro gets 10 pts
3. Create asado #3 → Juan gets 7 pts
4. Ranking: Juan 15 pts, Pedro 10 pts ✓

### 4. Edge Cases

**Minimum Attendees Not Met:**
- Only 3 users attend
- All get 0 points
- Warning shown
- Asado still saved ✓

**User Never Participates:**
- User shows in rankings with 0 points
- Positioned at bottom ✓

**Negative Total Points:**
- User: 5 participation points, -10 penalty points
- Total: -5 points
- Shows at bottom of rankings ✓

**Delete Asado:**
- Delete asado with participations
- Participations removed
- Points recalculated
- Rankings update ✓

## Deployment Checklist

### Pre-Deployment

- [x] All tests passing
- [x] Linter clean
- [x] Environment variables set
- [x] Database seeded with initial users
- [x] Build succeeds
- [x] No console errors

### Post-Deployment

- [x] Health check: `/` loads
- [x] Create test asado
- [x] Verify points calculation
- [x] Check rankings display
- [x] Mobile responsive
- [x] No 500 errors in logs

### Vercel KV Setup

```bash
# Required environment variables
KV_URL=xxx
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx
KV_REST_API_READ_ONLY_TOKEN=xxx
```

### Initial Data Seeding

Run once after deployment:

```bash
npx tsx scripts/init-data.ts
```

Should create:
- 8 users with names and birthdays
- Empty asados array
- Empty participations array
- Empty penalties array

## Success Criteria

✅ **Functional Requirements:**
- 8 friends can access the app
- Create asado in < 2 minutes
- Points calculate correctly automatically
- Rankings always up-to-date
- Penalties system works

✅ **Non-Functional Requirements:**
- Works on mobile phones
- No bugs, simple and fast
- Loads in < 2 seconds
- Mobile-first design
- Trust-based (no auth needed)

✅ **User Experience:**
- Intuitive navigation
- Clear feedback on actions
- Helpful warnings (< 4 attendees)
- Real-time point previews
- Responsive design

## Known Limitations (By Design)

⚠️ **MVP Constraints:**
- No authentication (trust-based)
- No edit history/audit log
- No automatic absence tracking
- No birthday reminders
- No expense tracking
- No photos or media
- Fixed list of 8 users
- Single year tournament

These are intentional scope limits, not bugs.

---

Last updated: 2026-01-18

