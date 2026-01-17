# Security Requirements for API Development

When developing APIs for games, follow these security guidelines.

## Mandatory Requirements

- ✅ Validate requests with Zod
- ✅ Error handling with try-catch
- ✅ Use NextResponse.json()
- ✅ Manage secrets with environment variables (process.env)

## Prohibited Patterns

- ❌ `eval()`, `new Function()`
- ❌ File operations (`fs.writeFileSync`, `fs.unlinkSync`, etc.)
- ❌ Shell command execution (`child_process.exec`, etc.)
- ❌ SQL injection (`db.query(\`${...}\`)`)

## Reference

For complete API development guidelines, see `.github/prompts/api-development-guidelines.txt`
