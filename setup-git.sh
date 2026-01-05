#!/usr/bin/env bash

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ROOT_DIR="$(pwd)"

print_step() {
  echo -e "${YELLOW}$1${NC}"
}

print_ok() {
  echo -e "${GREEN}$1${NC}"
}

print_warn() {
  echo -e "${RED}$1${NC}"
}

print_step "📝 Ensuring .gitignore exists and has Ngulikang rules..."

if [ ! -f .gitignore ]; then
  cat > .gitignore << 'EOG'
# ========================================
# .gitignore untuk Ngulikang Monorepo
# ========================================
EOG
  print_ok "✓ .gitignore created"
fi

if ! grep -q "# === Ngulikang Git Ignore ===" .gitignore; then
  cat >> .gitignore << 'EOG'

# === Ngulikang Git Ignore ===
# Env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Dependencies
node_modules/
**/node_modules/

# Build output
/dist/
/build/
**/dist/
**/build/

# Vite/CRA caches
.vite/
**/.vite/
.cache/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Database volumes
postgres_data/
pgdata/

# Docker override
docker-compose.override.yml

# Uploads & generated media
uploads/
backend/uploads/
public/uploads/

# IDE
.vscode/
.idea/
*.swp
*~

# OS
.DS_Store
Thumbs.db
EOG
  print_ok "✓ .gitignore updated"
else
  print_ok "✓ .gitignore already has Ngulikang rules"
fi

echo ""
print_step "📝 Ensuring .env.example exists..."

if [ ! -f .env.example ]; then
  cat > .env.example << 'EOG'
POSTGRES_USER=ngulikang_user
POSTGRES_PASSWORD=ngulikang_pass
POSTGRES_DB=ngulikang_db

JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key

PGADMIN_EMAIL=admin@ngulikang.local
PGADMIN_PASSWORD=admin
EOG
  print_ok "✓ .env.example created"
else
  print_ok "✓ .env.example already exists"
fi

echo ""
print_step "📝 Ensuring README.md exists..."

if [ ! -f README.md ]; then
  cat > README.md << 'EOG'
# Ngulikang Monorepo

This repository contains backend + 3 frontend apps.

Docker dev stack:
```bash
cp .env.example .env
docker compose up --build
```
EOG
  print_ok "✓ README.md created"
else
  print_ok "✓ README.md already exists"
fi

echo ""
print_step "🧪 Ensuring .env exists (not tracked)..."

if [ ! -f .env ]; then
  cp .env.example .env
  print_warn "⚠ .env created from .env.example. Update secrets before committing."
else
  print_ok "✓ .env already exists"
fi

echo ""
print_step "📦 Initializing git repository (if needed)..."

if [ -d .git ]; then
  print_ok "✓ Git repository already initialized"
else
  git init
  print_ok "✓ Git initialized"
fi

echo ""
print_step "🧹 Removing tracked files that should be ignored (if any)..."

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git ls-files --error-unmatch .env >/dev/null 2>&1; then
    git rm --cached .env
  fi

  tracked_paths=$(git ls-files | grep -E '(^|/)(node_modules|dist|build|uploads|postgres_data)($|/)' || true)
  if [ -n "${tracked_paths}" ]; then
    echo "${tracked_paths}" | xargs git rm -r --cached
  fi
fi

print_ok "✓ Cleanup complete"

echo ""
print_step "📦 Adding files to git..."

git add .
print_ok "✓ Files added"

echo ""
print_step "📊 Git status:"

git status --short || true

echo ""
print_ok "✅ Git setup finished"

echo -e "${YELLOW}Next steps:${NC}"
cat << 'EOT'
1) Review changes: git status
2) Commit: git commit -m "Initial commit"
3) Add remote: git remote add origin <repo-url>
4) Push: git branch -M main && git push -u origin main
EOT
