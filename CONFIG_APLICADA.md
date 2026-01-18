# Configuración Git Local para Torneo de Asados
# Este archivo documenta las configuraciones aplicadas a este repositorio

## Configuración actual del repositorio

Para ver la configuración actual, ejecuta:
```bash
git config --local --list
```

## Configuraciones aplicadas:

### 1. Credenciales personales
```bash
git config --local user.name "matiasarias"
git config --local user.email "matiasarias384@gmail.com"
```

### 2. Deshabilitar hooks globales de pre-commit
```bash
git config --local core.hooksPath /dev/null
```
**Motivo**: Evita que el pre-commit del trabajo interfiera con este repo personal.

### 3. Deshabilitar firma de commits (GPG/SSH)
```bash
git config --local commit.gpgsign false
git config --local gpg.format ""
```
**Motivo**: Evita que intente usar las claves SSH del trabajo para firmar commits.

## Verificar que funciona correctamente

```bash
# Ver el autor del último commit (debe ser tu email personal)
git log -1 --pretty=format:"%an <%ae>"

# Ver toda la configuración activa
git config --list --show-origin | grep -E "(user|commit|core.hooks|gpg)"
```

## Notas importantes

- ✅ Estas configuraciones SOLO afectan este repositorio
- ✅ Tu configuración de trabajo NO se ha modificado
- ✅ Cada commit en este repo usará tus datos personales
- ✅ No tendrás problemas con pre-commit ni firma de commits

## Si necesitas cambiar algo

```bash
# Cambiar nombre
git config --local user.name "Nuevo Nombre"

# Cambiar email
git config --local user.email "nuevo@email.com"

# Ver todas las configuraciones locales
git config --local --list
```

