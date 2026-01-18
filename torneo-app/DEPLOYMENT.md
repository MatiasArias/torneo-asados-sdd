# 🚀 Guía de Deployment - Torneo de Asadores

## ✅ Estado del Proyecto

Tu app está **100% completa** y lista para deployar:

- ✅ Next.js 15 con TypeScript
- ✅ Tailwind CSS configurado
- ✅ 3 páginas completas (Rankings, Crear Asado, Penalties)
- ✅ Lógica de cálculo de puntos implementada
- ✅ Sistema de calificación de asados (1-5 ⭐)
- ✅ API routes para CRUD completo
- ✅ Responsive (mobile-first)
- ✅ Vercel KV configurado

## 📋 Pasos para Deploy

### 1. Subir a GitHub

```bash
cd "/Users/matiasarias/Desktop/Personal/Demos/Torneo de asados/torneo-app"

# Inicializar git
git init
git add .
git commit -m "Initial commit: Torneo de Asadores MVP"

# Crear repositorio en GitHub (https://github.com/new)
# Luego conectar:
git branch -M main
git remote add origin https://github.com/TU-USUARIO/torneo-asadores.git
git push -u origin main
```

### 2. Deploy en Vercel

1. **Crear cuenta en Vercel**
   - Ve a https://vercel.com
   - Sign up con tu cuenta de GitHub

2. **Importar proyecto**
   - Click "Add New..." → "Project"
   - Autoriza acceso a tu GitHub
   - Selecciona el repo `torneo-asadores`
   - Vercel detecta automáticamente Next.js
   - Click "Deploy" (aún sin configurar KV)

3. **Configurar Vercel KV**
   - En tu proyecto desplegado, ve a la pestaña "Storage"
   - Click "Create Database"
   - Selecciona "KV" (Redis)
   - Nombre: `torneo-2025`
   - Region: Washington, D.C. (o la más cercana)
   - Click "Create"
   - Vercel automáticamente agrega las variables de entorno

4. **Redeploy**
   - Ve a la pestaña "Deployments"
   - Click en los 3 puntos del último deployment
   - Click "Redeploy"
   - Ahora la app tendrá acceso a KV ✅

### 3. Verificar que funciona

Tu app estará en: `https://torneo-asadores-[tu-user].vercel.app`

1. Abre la URL
2. Deberías ver la página de Rankings con los 8 usuarios
3. Click "Crear Asado" → funciona ✅
4. Click "Penalties" → funciona ✅

## 🎯 Datos Iniciales

La app viene pre-cargada con 8 usuarios:
- Juan (cumple: 15 de marzo)
- Pedro (cumple: 20 de mayo)
- Carlos (cumple: 10 de agosto)
- Luis (cumple: 5 de noviembre)
- Diego (cumple: 14 de febrero)
- Matias (cumple: 22 de julio)
- Santi (cumple: 30 de septiembre)
- Fede (cumple: 12 de diciembre)

**Para cambiar los nombres:** Edita el archivo `lib/db.ts` líneas 9-18, commit y push.

## 📱 Compartir con tus Amigos

1. Copia la URL de tu app
2. Envíala por WhatsApp al grupo
3. ¡Listo! Todos pueden:
   - Ver el ranking
   - Crear asados
   - Agregar penalties
   - Todo en tiempo real

**Nota:** La app no tiene autenticación (trust-based). Solo compartan la URL entre los 8 amigos.

## 🔄 Hacer Cambios

Si necesitas cambiar algo:

```bash
# 1. Edita los archivos
# 2. Commit y push
git add .
git commit -m "Descripción del cambio"
git push

# 3. Vercel auto-deployrá en 2-3 minutos
```

## 🆘 Troubleshooting

### Error: "Failed to fetch tournament data"
- Verifica que Vercel KV esté creado
- Verifica que las variables de entorno estén configuradas
- Redeploya la app

### Los puntos no se calculan
- Verifica que haya mínimo 4 asistentes marcados
- Si el asador tiene calificación (1-5)
- Refrezca la página

### No aparecen los 8 usuarios
- Vercel KV se inicializa automáticamente la primera vez
- Si no, puedes correr el script manualmente (ver README.md)

## 📊 Cómo Funciona

### Sistema de Puntos
- **Asar**: +3 fijos + calificación (1-5 ⭐) = 4 a 8 pts
- **Carne especial**: +1 (bonus)
- **Comprar solo**: +3 pts | Compartido: +1 pt c/u
- **Asistir**: +1 pt
- **Llegar a tiempo**: +1 pt
- **Llegar tarde**: +0.5 pts
- **Hostear**: +3 pts
- **Máximo**: 10 pts por asado

### Reglas
- Mínimo 4 asistentes para sumar puntos
- Calificación obligatoria si hay asador (1-5)
- Penalties se restan del total

## 🎉 ¡Listo!

Tu app está completa y funcional. Solo falta:
1. Subirla a GitHub
2. Deployar en Vercel
3. Compartir la URL

**¡Que comience el torneo! 🥩🔥**

---

**¿Necesitas ayuda?** 
- Revisa el README.md para más detalles
- Documentación de Vercel: https://vercel.com/docs
- Documentación de Next.js: https://nextjs.org/docs

