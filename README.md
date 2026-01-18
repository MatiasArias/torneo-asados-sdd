# 🥩 Torneo de Asados

Aplicación web para gestionar torneos de asados entre amigos, con sistema de puntos, rankings y penalizaciones.

🌐 **Demo en vivo**: [torneo-asados-sdd.vercel.app](https://torneo-asados-sdd.vercel.app)

## 📋 Características

- **Gestión de Asados**: Crea y programa asados con fecha, hora, ubicación y anfitrión
- **Sistema de Participación**: Registra quién asiste y quién falta a cada asado
- **Puntos Automáticos**: 
  - +10 puntos por asistir
  - +5 puntos adicionales por ser el anfitrión
  - +5 puntos de cumpleaños si es tu cumpleaños
- **Penalizaciones**: Sistema para gestionar faltas y sus castigos
- **Rankings en Tiempo Real**: Tabla de posiciones actualizada automáticamente
- **Responsive Design**: Funciona perfectamente en móviles y desktop

## 🛠️ Tecnologías

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Base de Datos**: [Vercel KV](https://vercel.com/storage/kv) (Redis)
- **Deployment**: [Vercel](https://vercel.com/)
- **Formularios**: React Hook Form + Zod

## 🚀 Desarrollo Local

### Requisitos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MatiasArias/torneo-asados-sdd.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Vercel KV

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm start        # Ejecutar build de producción
npm run lint     # Linter
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── asados/       # Endpoints de asados
│   │   ├── users/        # Endpoints de usuarios
│   │   └── penalties/    # Endpoints de penalizaciones
│   ├── asados/           # Páginas de asados
│   └── penalties/        # Páginas de penalizaciones
├── components/            # Componentes React
├── lib/                   # Utilidades y lógica de negocio
│   ├── db.ts             # Acceso a base de datos
│   ├── points.ts         # Cálculo de puntos
│   ├── rankings.ts       # Sistema de rankings
│   └── types.ts          # Tipos de TypeScript
└── scripts/              # Scripts de utilidad
```

## 🗄️ Base de Datos

La aplicación usa Vercel KV (Redis) para almacenar:
- Usuarios y sus cumpleaños
- Asados programados
- Participaciones
- Penalizaciones

Para inicializar los datos:

```bash
# Ejecutar script de inicialización (una sola vez)
npx tsx scripts/init-data.ts
```

## 📚 Documentación

- [SPEC.md](./SPEC.md) - Especificación técnica completa
- [STATUS.md](./STATUS.md) - Estado del proyecto y roadmap
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de deployment

## 🤝 Contribuir

Este es un proyecto personal, pero las sugerencias son bienvenidas. 

## 📄 Licencia

Este proyecto es de uso personal.

---

Desarrollado con ❤️ y 🥩 por [Matias Arias](https://github.com/MatiasArias)

