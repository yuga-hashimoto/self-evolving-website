#!/bin/bash
# Security Check Script for AI Evolution Workflows
# Usage: ./scripts/security-check.sh <model_id>
#
# Exit codes:
#   0 - All checks passed
#   1 - Critical security issues found

set -euo pipefail

MODEL_ID="${1:?Error: Model ID required. Usage: $0 <model_id>}"
PLAYGROUND_DIR="src/app/models/$MODEL_ID/playground"
API_DIR="src/app/api"

CRITICAL_ERRORS=0
WARNINGS=0

echo "🔒 Running security checks for model: $MODEL_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# CRITICAL: eval/Function in API routes
echo "Checking for code execution patterns..."
if grep -rE "eval\(|new Function\(|Function\(" "$API_DIR" 2>/dev/null; then
  echo "❌ CRITICAL: Code execution patterns detected in API routes!"
  echo "   Detected patterns: eval(), new Function(), or Function() constructor"
  CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
else
  echo "✅ No code execution patterns found"
fi

# CRITICAL: SQL injection patterns
echo "Checking for SQL injection patterns..."
if grep -rE 'db\.query\(.*\$\{|execute\(.*\$\{|raw\(.*\$\{' "$API_DIR" 2>/dev/null; then
  echo "❌ CRITICAL: Potential SQL injection vulnerability!"
  echo "   Detected string interpolation in database queries"
  CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
else
  echo "✅ No SQL injection patterns found"
fi

# CRITICAL: Unauthorized file system access
echo "Checking for unauthorized file system operations..."
if grep -rE "fs\.writeFileSync|fs\.unlinkSync|fs\.rmdirSync|child_process\.exec" "$API_DIR" 2>/dev/null; then
  echo "❌ CRITICAL: Unauthorized file system/process operations!"
  echo "   File system writes and process execution are not allowed"
  CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
else
  echo "✅ No unauthorized file operations found"
fi

# WARNING: dangerouslySetInnerHTML
echo "Checking for dangerouslySetInnerHTML usage..."
if [ -d "$PLAYGROUND_DIR" ] && grep -r "dangerouslySetInnerHTML" "$PLAYGROUND_DIR" 2>/dev/null; then
  echo "⚠️  Warning: dangerouslySetInnerHTML detected in playground"
  WARNINGS=$((WARNINGS + 1))
elif grep -r "dangerouslySetInnerHTML" "$API_DIR" 2>/dev/null; then
  echo "⚠️  Warning: dangerouslySetInnerHTML detected in API"
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ No dangerouslySetInnerHTML usage found"
fi

# WARNING: Non-public env exposure
echo "Checking for non-public environment variable exposure..."
if [ -d "$PLAYGROUND_DIR" ] && grep -r "process\.env\." "$PLAYGROUND_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "NEXT_PUBLIC_" | grep -v "^Binary"; then
  echo "⚠️  Warning: Non-public environment variable may be exposed in client code"
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ No non-public env exposure found"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Results: $CRITICAL_ERRORS critical errors, $WARNINGS warnings"

if [ $CRITICAL_ERRORS -gt 0 ]; then
  echo "❌ Security checks FAILED - critical issues must be resolved"
  exit 1
fi

echo "✅ Security checks passed"
exit 0
