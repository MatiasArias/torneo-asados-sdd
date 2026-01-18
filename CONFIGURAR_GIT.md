# Configuración de Git Personal

Este repositorio está configurado para usar credenciales personales de GitHub, separadas de las del trabajo.

## Paso 1: Configurar tu nombre y email personal

Ejecuta estos comandos en la terminal (reemplaza con tus datos):

```bash
cd /Users/matiasarias/Desktop/Personal
git config --local user.name "Tu Nombre Personal"
git config --local user.email "tuemail@personal.com"
```

## Paso 2: Verificar la configuración

```bash
git config --local --list
```

Deberías ver tu nombre y email personal.

## Paso 3: Configurar SSH Keys o HTTPS

### Opción A: Usar SSH (Recomendado)

1. Genera una clave SSH personal (si no tienes una):
```bash
ssh-keygen -t ed25519 -C "tuemail@personal.com" -f ~/.ssh/id_ed25519_personal
```

2. Agrega la clave al ssh-agent:
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_personal
```

3. Copia la clave pública y agrégala a tu cuenta de GitHub personal:
```bash
cat ~/.ssh/id_ed25519_personal.pub | pbcopy
```
   - Ve a GitHub.com → Settings → SSH and GPG keys → New SSH key
   - Pega la clave

4. Configura el archivo `~/.ssh/config` para usar esta clave:
```
# GitHub Personal
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes
```

5. Al clonar o agregar remotes, usa:
```bash
git remote add origin git@github.com-personal:tu-usuario/tu-repo.git
```

### Opción B: Usar HTTPS con Token Personal

1. Genera un Personal Access Token en GitHub:
   - Ve a GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token → Selecciona los scopes necesarios

2. Al hacer push, usa tu token como contraseña o configura el credential helper:
```bash
git config --local credential.helper store
```

## Paso 4: Configuración adicional (Opcional)

### Evitar conflictos con configuración global

Si quieres asegurarte de que SIEMPRE uses las credenciales personales en esta carpeta:

```bash
# Deshabilitar la configuración global solo para este repo
git config --local include.path ""
```

### Configurar el remote correctamente

Si ya tienes un repositorio remoto:
```bash
git remote add origin git@github.com-personal:tu-usuario/tu-repo.git
# o para HTTPS:
git remote add origin https://github.com/tu-usuario/tu-repo.git
```

## Verificación Final

```bash
# Ver toda la configuración activa (local > global)
git config --list --show-origin | grep user

# Hacer un commit de prueba
git add .
git commit -m "Test commit"

# Verificar el autor del commit
git log -1 --pretty=format:"%an <%ae>"
```

## Importante ⚠️

- La configuración `--local` solo afecta a esta carpeta
- Tus configuraciones de trabajo permanecen intactas
- Cada carpeta puede tener su propia configuración de Git

