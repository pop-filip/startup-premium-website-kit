#!/bin/bash

# ============================================================
# HUSKY + LINT-STAGED SETUP
# Run this script once in your project root:
#   chmod +x setup-hooks.sh && ./setup-hooks.sh
# ============================================================

echo "📦 Installing Husky + lint-staged..."
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

echo "🐕 Initializing Husky..."
npx husky init

echo "📝 Creating pre-commit hook..."
cat > .husky/pre-commit << 'EOF'
npx lint-staged
EOF

echo "📝 Creating commit-msg hook..."
cat > .husky/commit-msg << 'EOF'
npx --no -- commitlint --edit ${1}
EOF

echo "📝 Creating pre-push hook..."
cat > .husky/pre-push << 'EOF'
npm run build
npm test -- --watchAll=false
EOF

echo "✅ Done! Git hooks are set up."
echo ""
echo "Add this to your package.json:"
echo ""
cat << 'EOF'
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --max-warnings 0",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
EOF
