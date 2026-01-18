# Admin: Data Cleanup

## Overview

Herramienta administrativa para limpiar/resetear todos los datos del torneo. Útil para:
- Resetear datos de prueba en producción
- Comenzar una nueva temporada
- Limpiar datos irreales después de testing

## Access

### UI Method (Recomendado)
**URL:** `/admin/clean`

**Características:**
- ✅ Interfaz visual intuitiva
- ✅ Advertencias claras
- ✅ Doble confirmación (dialog + código)
- ✅ Protegido con código de acceso (20182024)
- ✅ Feedback visual de resultado
- ✅ Redirección automática al home

### API Method (Para Scripts)
**Endpoint:** `POST /api/admin/clean`

**Body:**
```json
{
  "code": "20182024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data cleaned successfully",
  "stats": {
    "users": 9,
    "asados": 0,
    "participations": 0,
    "penalties": 0
  }
}
```

### Script Method (Local Development)
**Command:** `npx tsx scripts/clean-data.ts`

**Uso:**
- Solo para desarrollo local
- Requiere acceso directo al filesystem
- No funciona en producción

## What Gets Deleted

| Item | Deleted | Kept |
|------|---------|------|
| Asados | ✅ All | ❌ |
| Participations | ✅ All | ❌ |
| Penalties | ✅ All | ❌ |
| Users | ❌ | ✅ All 9 users |

## Flow

### UI Flow:
1. Navigate to `/admin/clean`
2. Read warnings
3. Click "🗑️ Limpiar Todos los Datos"
4. Confirm in browser dialog
5. Enter access code (20182024)
6. Data cleaned
7. Success message shown
8. Auto-redirect to home in 3 seconds

### API Flow:
1. Send POST to `/api/admin/clean` with code
2. Verify code
3. Clean data (keep users)
4. Return success response

## Security

- ✅ Protected by access code (20182024)
- ✅ Double confirmation required
- ✅ No accidental deletions possible
- ✅ Admin-only operation

## After Cleanup

- All users remain in system
- All scores reset to 0
- Rankings show all users with 0 points
- Ready for new tournament season

## Files

- `app/admin/clean/page.tsx` - Admin UI page
- `app/api/admin/clean/route.ts` - API endpoint
- `scripts/clean-data.ts` - Local script

## Use Cases

1. **Start New Season**: Clean all data at year end
2. **Fix Test Data**: Remove test asados from production
3. **Reset After Bug**: Clean corrupted data
4. **Demo Reset**: Prepare for demonstrations

---

**⚠️ Warning:** This operation cannot be undone. Always confirm you're in the correct environment before executing.

