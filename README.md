# 🥩 Torneo de Asados

Repositorio personal para el proyecto "Torneo de Asados".

## 🔧 Configuración inicial de Git

Este repositorio está configurado para usar tus credenciales **personales** de GitHub, completamente separadas de las del trabajo.

### Configuración rápida

Ejecuta el script de configuración:

```bash
cd "/Users/matiasarias/Desktop/Personal/Demos/Torneo de asados"
./configurar-git-personal.sh
```

### Configuración manual

```bash
cd "/Users/matiasarias/Desktop/Personal/Demos/Torneo de asados"

# Configurar tus credenciales personales
git config --local user.name "Tu Nombre Personal"
git config --local user.email "tuemail@personal.com"

# Cambiar rama a main (opcional)
git branch -M main

# Verificar configuración
git config --local --list
```

## 📚 Documentación adicional

- **CONFIGURAR_GIT.md**: Guía completa sobre cómo configurar SSH, tokens y autenticación
- **configurar-git-personal.sh**: Script interactivo para configurar Git

## 🚀 Conectar con GitHub

### Crear el repositorio en GitHub

1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio llamado "torneo-de-asados" (o el nombre que prefieras)
3. **NO** inicialices con README, .gitignore o licencia

### Conectar este repositorio

**Con SSH (recomendado):**
```bash
git remote add origin git@github.com-personal:tu-usuario/torneo-de-asados.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Con HTTPS:**
```bash
git remote add origin https://github.com/tu-usuario/torneo-de-asados.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

## ✅ Verificar que todo funciona

```bash
# Ver toda la configuración activa
git config --list --show-origin | grep user

# Hacer un commit de prueba
git add README.md
git commit -m "Test commit"

# Verificar el autor del commit (debe ser tu email personal)
git log -1 --pretty=format:"%an <%ae>"
```

---

**Importante**: Esta configuración solo afecta a este repositorio. Tus credenciales de trabajo no se han modificado.

