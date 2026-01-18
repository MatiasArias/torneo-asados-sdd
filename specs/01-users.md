# Feature: Users Management

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Dependencies
- **Requires**: None (foundational feature)
- **Blocks**: All other features depend on users

## Overview

Fixed list of 8 users representing the friend group participating in the tournament.

## Specification

### User Properties
- **ID**: Unique identifier (string)
- **Name**: Display name (string)
- **Birthday**: Birth date in MM-DD format for birthday tracking

### Constraints
- Fixed list of exactly 8 users
- No user registration or signup
- No authentication required
- Users are hardcoded/seeded in database

## Data Model

### Vercel KV Structure

```json
{
  "users": [
    {
      "id": "1",
      "name": "Juan",
      "birthday": "03-15"
    },
    {
      "id": "2",
      "name": "Pedro",
      "birthday": "05-20"
    }
    // ... 6 more users
  ]
}
```

### Initial Seed Data

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
  ]
}
```

## API Contracts

### GET /api/users
**Response:**
```typescript
{
  users: User[]
}
```

### User Type Definition
```typescript
interface User {
  id: string;
  name: string;
  birthday: string; // MM-DD format
}
```

## Business Rules

1. **No Registration**: Users are pre-defined, no sign-up process
2. **No Authentication**: Trust-based access, anyone can view/edit
3. **Fixed List**: Cannot add/remove users through UI
4. **Birthday Format**: Always MM-DD for consistency

## UI/UX

### User Display
- Users appear in dropdown selectors (host, participants)
- Users appear in rankings table
- Birthday shown in helper text (e.g., "Próximo cumpleaños: Juan (15 de marzo)")

### No User Profile Pages
- Users don't have individual profile pages
- All user data shown in context (rankings, asado forms)

## Implementation Details

### Files
- `lib/types.ts` - User type definition
- `lib/db.ts` - User CRUD operations
- `app/api/users/route.ts` - Users API endpoint
- `scripts/init-data.ts` - Initial user seeding

### Database Operations
```typescript
// Get all users
const users = await getUsers();

// Get user by ID
const user = await getUserById(id);

// Get upcoming birthday
const nextBirthday = getNextBirthday(users);
```

## Test Scenarios

### ✅ Basic Operations
1. Fetch all users → Returns 8 users
2. Each user has id, name, birthday
3. Birthday format is MM-DD

### ✅ Birthday Helper
1. System identifies next upcoming birthday
2. Shows user name and date
3. Used for birthday penalty tracking

## Implementation Checklist
- [x] User type definition
- [x] Database seeding script
- [x] GET /api/users endpoint
- [x] User selection in forms
- [x] Birthday helper display
- [x] Tests for user operations

---

Last updated: 2026-01-18

