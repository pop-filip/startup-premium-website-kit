#!/bin/bash
# ============================================================
# Digital Nature — QA Check
# Pokretanje: bash ~/tool-kit/utils/qa-check.sh ./html/index.html [--fix]
#
# Opcije:
#   --fix       Auto-fix česte probleme (missing alt, viewport)
#   --json      Output u JSON formatu (za email/logging)
#   --strict    Fail ako score < 90 (default: 80)
# ============================================================

HTML_FILE="${1:-./html/index.html}"
AUTO_FIX=false
JSON_OUTPUT=false
THRESHOLD=80

for arg in "$@"; do
  case $arg in
    --fix)    AUTO_FIX=true ;;
    --json)   JSON_OUTPUT=true ;;
    --strict) THRESHOLD=90 ;;
  esac
done

# ─── COLORS ────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'
TICK="✅"
WARN="⚠️ "
FAIL="❌"

# ─── VALIDATE INPUT ────────────────────────────────────────
if [ ! -f "$HTML_FILE" ]; then
  echo -e "${RED}${FAIL} File not found: $HTML_FILE${NC}"
  exit 1
fi

PROJECT_NAME=$(basename "$(dirname "$(dirname "$HTML_FILE")")")
ISSUES=0
WARNINGS=0
FIXES=0
REPORT_LINES=()

log_pass()  { REPORT_LINES+=("${TICK}  $1"); }
log_warn()  { REPORT_LINES+=("${WARN} $1"); ((WARNINGS++)); }
log_fail()  { REPORT_LINES+=("${FAIL}  $1"); ((ISSUES++)); }
log_fix()   { REPORT_LINES+=("🔧  $1 — auto-fixed"); ((FIXES++)); }

# ─── HTML CHECKS ───────────────────────────────────────────

# 1. Viewport meta
if grep -q 'name="viewport"' "$HTML_FILE"; then
  log_pass "Viewport meta:       OK"
else
  if $AUTO_FIX; then
    sed -i '' 's|<head>|<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">|' "$HTML_FILE"
    log_fix "Viewport meta:       missing → added"
  else
    log_fail "Viewport meta:       MISSING"
  fi
fi

# 2. Title tag
TITLE=$(python3 -c "
import re, sys
html = open('$HTML_FILE').read()
m = re.search(r'<title[^>]*>(.*?)</title>', html, re.DOTALL)
print(m.group(1).strip() if m else '')
" 2>/dev/null)
TITLE_LEN=${#TITLE}
if [ -z "$TITLE" ]; then
  log_fail "Title tag:           MISSING"
elif [ "$TITLE_LEN" -lt 30 ]; then
  log_warn "Title tag:           Too short (${TITLE_LEN} chars, min 30)"
elif [ "$TITLE_LEN" -gt 65 ]; then
  log_warn "Title tag:           Too long (${TITLE_LEN} chars, max 65)"
else
  log_pass "Title tag:           OK  (${TITLE_LEN} chars)"
fi

# 3. Meta description
META_DESC=$(grep -o 'name="description" content="[^"]*"' "$HTML_FILE" | sed 's/.*content="//;s/"//' | head -1)
if [ -z "$META_DESC" ]; then
  META_DESC=$(grep -o 'content="[^"]*" name="description"' "$HTML_FILE" | sed 's/content="//;s/" name.*//' | head -1)
fi
META_LEN=${#META_DESC}
if [ -z "$META_DESC" ]; then
  log_fail "Meta description:    MISSING"
elif [ "$META_LEN" -lt 100 ]; then
  log_warn "Meta description:    Too short (${META_LEN} chars, min 100)"
elif [ "$META_LEN" -gt 165 ]; then
  log_warn "Meta description:    Too long (${META_LEN} chars, max 165)"
else
  log_pass "Meta description:    OK  (${META_LEN} chars)"
fi

# 4. H1 — postoji i jedinstven
H1_COUNT=$(python3 -c "
import re
html = open('$HTML_FILE').read()
print(len(re.findall(r'<h1[^>]*>', html, re.IGNORECASE)))
" 2>/dev/null)
if [ "$H1_COUNT" -eq 0 ]; then
  log_fail "H1 tag:              MISSING"
elif [ "$H1_COUNT" -gt 1 ]; then
  log_warn "H1 tag:              ${H1_COUNT} found — should be unique"
else
  log_pass "H1 tag:              OK  (unique)"
fi

# 5. Alt atributi na img tagovima
IMGS_RESULT=$(python3 -c "
import re
html = open('$HTML_FILE').read()
imgs = re.findall(r'<img[^>]+>', html, re.IGNORECASE)
total = len(imgs)
missing = sum(1 for i in imgs if 'alt=' not in i.lower())
print(f'{total} {missing}')
" 2>/dev/null)
TOTAL_IMGS=$(echo $IMGS_RESULT | cut -d' ' -f1)
MISSING_ALT=$(echo $IMGS_RESULT | cut -d' ' -f2)
if [ "$MISSING_ALT" -gt 0 ] && $AUTO_FIX; then
  python3 -c "
import re, sys
html = open('$HTML_FILE').read()
def add_alt(m):
    tag = m.group(0)
    if 'alt=' not in tag.lower():
        tag = tag.rstrip('>')
        if tag.endswith('/'): tag = tag[:-1].rstrip() + ' alt=\"\"/'
        else: tag = tag + ' alt=\"\"'
    return tag + '>'
html = re.sub(r'<img[^>]+>', add_alt, html, flags=re.IGNORECASE)
open('$HTML_FILE', 'w').write(html)
" 2>/dev/null
  log_fix "Alt attributes:      ${MISSING_ALT}/${TOTAL_IMGS} missing → alt=\"\" added"
elif [ "$MISSING_ALT" -gt 0 ]; then
  log_warn "Alt attributes:      ${MISSING_ALT}/${TOTAL_IMGS} missing"
else
  log_pass "Alt attributes:      OK  (${TOTAL_IMGS}/${TOTAL_IMGS})"
fi

# 6. Canonical link
if grep -q 'rel="canonical"' "$HTML_FILE"; then
  log_pass "Canonical link:      OK"
else
  log_warn "Canonical link:      MISSING"
fi

# 7. Schema.org JSON-LD
if grep -q 'application/ld+json' "$HTML_FILE"; then
  log_pass "Schema.org:          OK"
else
  log_warn "Schema.org:          No JSON-LD found"
fi

# 8. OG tags
OG_COUNT=$(grep -c 'property="og:' "$HTML_FILE" 2>/dev/null || echo 0)
if [ "$OG_COUNT" -ge 4 ]; then
  log_pass "Open Graph tags:     OK  (${OG_COUNT} tags)"
else
  log_warn "Open Graph tags:     Only ${OG_COUNT} tags (min 4: title, desc, image, url)"
fi

# 9. Responsive check — max-width ili container class
if grep -qE 'max-width|\.container|@media' "$HTML_FILE"; then
  log_pass "Responsive layout:   OK"
else
  log_warn "Responsive layout:   No media queries or container found"
fi

# 10. prefers-reduced-motion
if grep -q 'prefers-reduced-motion' "$HTML_FILE"; then
  log_pass "Reduced motion:      OK"
else
  log_warn "Reduced motion:      Missing @media (prefers-reduced-motion)"
fi

# ─── LIGHTHOUSE ────────────────────────────────────────────
LIGHTHOUSE_SCORES=""
if command -v lighthouse &> /dev/null; then
  # Potreban je live URL — preskačemo ako je lokalni fajl
  DOMAIN=$(grep -o 'canonicalhref="[^"]*"' "$HTML_FILE" 2>/dev/null | head -1 | sed 's/.*href="\(.*\)"/\1/')
  if [ -z "$DOMAIN" ]; then
    DOMAIN=$(grep -o 'rel="canonical"' "$HTML_FILE" 2>/dev/null)
  fi
  log_warn "Lighthouse:          Installed — run manually: lighthouse https://[domena] --only-categories=performance,accessibility,seo"
else
  log_warn "Lighthouse:          Not installed (npm install -g lighthouse)"
fi

# ─── SCORE CALCULATION ─────────────────────────────────────
# Simple score: 100 - (issues*20) - (warnings*5)
SCORE=$((100 - ISSUES * 20 - WARNINGS * 5))
[ $SCORE -lt 0 ] && SCORE=0

# ─── OUTPUT ────────────────────────────────────────────────
if $JSON_OUTPUT; then
  python3 -c "
import json, sys
data = {
  'project': '$PROJECT_NAME',
  'html_file': '$HTML_FILE',
  'score': $SCORE,
  'issues': $ISSUES,
  'warnings': $WARNINGS,
  'fixes_applied': $FIXES,
  'pass': $SCORE >= $THRESHOLD,
  'threshold': $THRESHOLD
}
print(json.dumps(data, indent=2))
"
else
  echo ""
  echo -e "${BOLD}QA REPORT — ${PROJECT_NAME}${NC}"
  echo "──────────────────────────────────────"
  for line in "${REPORT_LINES[@]}"; do
    echo "  $line"
  done
  echo "──────────────────────────────────────"
  if [ $FIXES -gt 0 ]; then
    echo -e "  ${DIM}Auto-fixes applied: ${FIXES}${NC}"
  fi
  echo ""
  if [ $SCORE -ge $THRESHOLD ]; then
    echo -e "  ${GREEN}${BOLD}Score: ${SCORE}/100 → PASS ✅${NC}"
    echo -e "  ${DIM}(threshold: ${THRESHOLD})${NC}"
  else
    echo -e "  ${RED}${BOLD}Score: ${SCORE}/100 → FAIL ❌${NC}"
    echo -e "  ${DIM}Fix ${ISSUES} issue(s) before deploying to preview.${NC}"
  fi
  echo ""
fi

# Exit code za CI usage
[ $SCORE -ge $THRESHOLD ]
