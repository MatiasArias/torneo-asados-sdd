#!/bin/bash

echo "======================================"
echo "Configuración de Git Personal"
echo "======================================"
echo ""

# Solicitar información
read -p "Ingresa tu nombre personal (ej: Juan Pérez): " nombre
read -p "Ingresa tu email personal (ej: juan@gmail.com): " email

# Configurar git local
cd "/Users/matiasarias/Desktop/Personal/Demos/Torneo de asados"
git config --local user.name "$nombre"
git config --local user.email "$email"

echo ""
echo "✓ Configuración aplicada!"
echo ""
echo "Configuración actual:"
git config --local --list | grep user

echo ""
echo "======================================"
echo "Siguiente paso: Configurar autenticación"
echo "======================================"
echo ""
echo "Elige una opción:"
echo "1) Usar SSH (Recomendado - más seguro)"
echo "2) Usar HTTPS con Token"
echo "3) Configurar después"
echo ""
read -p "Opción (1-3): " opcion

case $opcion in
  1)
    echo ""
    echo "Generando clave SSH personal..."
    ssh-keygen -t ed25519 -C "$email" -f ~/.ssh/id_ed25519_personal
    
    echo ""
    echo "Agregando clave al ssh-agent..."
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519_personal
    
    echo ""
    echo "Tu clave pública (copiada al portapapeles):"
    cat ~/.ssh/id_ed25519_personal.pub | pbcopy
    cat ~/.ssh/id_ed25519_personal.pub
    
    echo ""
    echo "Pasos siguientes:"
    echo "1. Ve a: https://github.com/settings/keys"
    echo "2. Click en 'New SSH key'"
    echo "3. Pega la clave (ya está en tu portapapeles)"
    echo "4. Guarda"
    echo ""
    
    # Configurar ~/.ssh/config
    echo "Configurando ~/.ssh/config..."
    if ! grep -q "github.com-personal" ~/.ssh/config 2>/dev/null; then
      cat >> ~/.ssh/config << 'EOF'

# GitHub Personal
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes
EOF
      echo "✓ Configuración SSH agregada"
    else
      echo "⚠ La configuración SSH ya existe"
    fi
    
    echo ""
    echo "Para usar esta clave, clona con:"
    echo "git clone git@github.com-personal:tu-usuario/repo.git"
    ;;
    
  2)
    echo ""
    echo "Para usar HTTPS con Token:"
    echo "1. Ve a: https://github.com/settings/tokens"
    echo "2. Generate new token (classic)"
    echo "3. Selecciona los scopes necesarios (repo, workflow, etc.)"
    echo "4. Copia el token"
    echo "5. Al hacer push, usa el token como contraseña"
    echo ""
    echo "Opcional: Guardar credenciales localmente"
    read -p "¿Guardar credenciales? (s/n): " guardar
    if [ "$guardar" = "s" ]; then
      git config --local credential.helper store
      echo "✓ Credential helper configurado"
    fi
    ;;
    
  3)
    echo ""
    echo "Puedes configurar la autenticación después."
    echo "Lee el archivo CONFIGURAR_GIT.md para más detalles."
    ;;
esac

echo ""
echo "======================================"
echo "✓ Configuración completada!"
echo "======================================"
echo ""
echo "Tu carpeta Personal ahora usa:"
echo "  Nombre: $nombre"
echo "  Email: $email"
echo ""
echo "Las credenciales de tu trabajo NO se han modificado."
echo ""

