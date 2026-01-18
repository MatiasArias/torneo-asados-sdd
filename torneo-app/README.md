# 🥩 Torneo de Asadores 2025

Web app para gestionar el torneo de asados entre amigos.

## 🚀 Deployment en Vercel

### 1. Crear cuenta en Vercel
- Ve a [vercel.com](https://vercel.com)
- Crea una cuenta con tu GitHub

### 2. Sube el proyecto a GitHub
```bash
cd torneo-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <tu-repo-url>
git push -u origin main
```

### 3. Importa el proyecto en Vercel
- En Vercel dashboard, click "Add New" → "Project"
- Importa tu repositorio de GitHub
- Vercel detectará automáticamente que es Next.js

### 4. Configura Vercel KV
- En tu proyecto de Vercel, ve a la pestaña "Storage"
- Click "Create Database" → "KV"
- Nombra la base de datos: `torneo-2025`
- Click "Create"
- Vercel automáticamente agregará las variables de entorno necesarias

### 5. Deploy
- Click "Deploy"
- Espera 2-3 minutos
- ¡Listo! Tu app está en línea 🎉

## 🎮 Uso de la App

### Crear un Asado
1. En la home, click "Crear Asado"
2. Completa la información básica (nombre, fecha, ubicación, anfitrión)
3. Marca los checkboxes para cada participante:
   - **Asador**: Si cocinó (requiere calificación 1-5 ⭐)
   - **Calificación**: De 1 a 5 estrellas (decide el grupo)
   - **Compró**: Si fue a comprar
   - **Asistió**: Si estuvo presente
   - **A tiempo**: Si llegó en los primeros 10 min
   - **Tarde**: Si llegó tarde (10min - 1h)
   - **Hosteó**: Si fue anfitrión
   - **C. Esp.**: Carne especial (bicho/costillar, solo si fue asador)
4. Click "Crear Asado"
5. Los puntos se calculan automáticamente ✨

### Ver Rankings
- La página principal muestra el ranking actualizado
- Podio con los top 3
- Tabla completa con estadísticas

### Gestionar Penalties
1. Click "Penalties"
2. Click "+ Agregar Penalty"
3. Selecciona usuario, puntos a restar y razón
4. Los penalties se restan automáticamente del total

## 📊 Sistema de Puntos

### Puntos por rol:
- **Asar**: +3 fijos + calificación (1-5) = **4 a 8 puntos**
- **Carne especial**: +1 (bonus si es asador)
- **Comprar solo**: +3 puntos
- **Comprar compartido**: +1 punto por persona
- **Asistir**: +1 punto
- **Llegar a tiempo**: +1 punto
- **Llegar tarde**: +0.5 puntos
- **Hostear**: +3 puntos

### Reglas:
- Mínimo **4 asistentes** para que el asado sume puntos
- Máximo **10 puntos** por persona por asado
- **Calificación obligatoria** si hay asador (1-5 ⭐)

### Penalties comunes:
- Comportamiento antideportivo: **-3 puntos**
- No hostear en el año: **-3 puntos**
- Tercer ausencia consecutiva: **-1 punto**

## 🛠️ Desarrollo Local (Opcional)

Si quieres correr la app localmente:

```bash
# Instalar dependencias
npm install

# Crear .env.local con tus credenciales de Vercel KV
# (copia las variables desde Vercel dashboard)

# Correr en desarrollo
npm run dev
```

La app estará en `http://localhost:3000`

## 📱 Características

- ✅ Responsive (funciona perfecto en móvil)
- ✅ Cálculo automático de puntos
- ✅ Rankings en tiempo real
- ✅ Sistema de calificación de asados (1-5 ⭐)
- ✅ Gestión de penalties
- ✅ Historial de asados
- ✅ Sin autenticación (trust-based)

## 🎯 URL de la App

Después del deployment, tu app estará en:
```
https://torneo-app-[tu-username].vercel.app
```

Comparte esta URL solo con los 8 amigos del torneo.

---

**¡Que gane el mejor asador! 🏆🔥**
