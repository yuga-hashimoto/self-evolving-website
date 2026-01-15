# Changes Summary - 2026-01-15

## Overview
This commit includes cleanup of deprecated workflows, enabling scheduled execution for Skill-based workflows, fixing changelog data inconsistencies, and improving screenshot path generation for same-day multiple updates.

## 1. Workflow Cleanup and Migration

### Deleted Files (Old Workflow System)
- `.github/workflows/ai-evolve-grok.yml` - Removed old Grok workflow
- `.github/workflows/ai-evolve-mimo.yml` - Removed old MiMo workflow
- `.github/workflows/reusable-evolve-model.yml` - Removed old reusable workflow template
- `.claude/skills/evolve-game.md` - Moved to directory structure

### Reason
The old workflow system has been replaced with the new Skill-based system (`reusable-evolve-model-skill.yml`). These files are no longer needed.

## 2. Enable Scheduled Execution for Skill Workflows

### Modified Files
- `.github/workflows/ai-evolve-grok-skill.yml`
  - **Changed**: Uncommented cron schedule
  - **Before**: Commented out schedule
  - **After**:
    ```yaml
    schedule:
      - cron: '30 9 * * *'   # UTC 9:30 (JST 18:30)
      - cron: '30 21 * * *'  # UTC 21:30 (JST 6:30)
    ```

- `.github/workflows/ai-evolve-mimo-skill.yml`
  - **Changed**: Uncommented cron schedule
  - **Before**: Commented out schedule
  - **After**:
    ```yaml
    schedule:
      - cron: '0 9 * * *'   # UTC 9:00 (JST 18:00)
      - cron: '0 21 * * *'  # UTC 21:00 (JST 6:00)
    ```

### Reason
Enable automatic execution of Skill-based workflows on schedule (twice daily).

## 3. Fix Changelog Data Inconsistencies

### Modified Files
- `public/models/grok/changelog.json`
  - **Fixed date format**: Changed from `"2026-01-15"` to ISO 8601 format with timestamps
    - Entry 1: `"2026-01-15T07:48:54Z"`
    - Entry 2: `"2026-01-15T12:17:56Z"`
  - **Fixed metrics**: Corrected `codeChanges` values
    - Entry 2: `filesChanged: 3 → 2`, `additions: 33 → 334`

- `public/models/mimo/changelog.json`
  - **Fixed metrics**: Corrected `codeChanges` values
    - Entry 3: `filesChanged: 4 → 1`, `additions: 737 → 706`, `deletions: 97 → 78`

### Reason
- Date format was inconsistent (some entries had time, others didn't)
- Metrics were incorrect, likely due to workflow bugs or manual edits
- Standardize to ISO 8601 format with full timestamps for better precision

## 4. Improve Screenshot Path Generation

### Modified Files
- `src/app/changelogs/compare/page.tsx`
  - **Changed**: `getScreenshotPath()` function now handles same-day multiple updates
  - **Logic**: When multiple changelog entries exist for the same date, append sequence number (`-1`, `-2`, etc.) to screenshot filename
  - **Example**:
    - First update on 2026-01-15: `/models/grok/screenshots/2026-01-15-1.png`
    - Second update on 2026-01-15: `/models/grok/screenshots/2026-01-15-2.png`
  - **Layout change**: Changed from side-by-side (md:grid-cols-2) to vertical stacking (space-y-4) for better mobile experience
  - **Alignment**: Changed Grok cards from left-aligned to right-aligned for consistency

- `src/app/models/[modelId]/changelog/page.tsx`
  - **Changed**: Same `getScreenshotPath()` logic as compare page
  - **Fixed**: Improved null safety for error metrics display

### Reason
Previously, when multiple updates occurred on the same day, screenshots would overwrite each other (commit 3d79af9 added sequence numbers to screenshot generation). This change ensures the UI correctly references those numbered screenshots.

## 5. Skill File Cleanup

### Modified Files
- `.claude/skills/evolve-game/SKILL.md`
  - **Note**: Previous commits (8ea9097, 4e2f5db) added mobile compatibility requirements and removed concrete examples
  - **Current state**: Contains abstract requirements without specific code examples to encourage AI creativity

### Reason
Part of the migration from flat file structure to directory-based skill organization.

## Summary of Changes
- ✅ Removed 4 deprecated workflow files (old system cleanup)
- ✅ Enabled cron schedules for 2 Skill-based workflows (auto-execution)
- ✅ Fixed changelog date formats and metrics for Grok and MiMo
- ✅ Enhanced screenshot path generation for same-day multiple updates
- ✅ Improved changelog UI layout and alignment
- ✅ Completed skill file migration

## Impact
- **Automation**: Skill-based workflows will now run automatically twice daily
- **Data Integrity**: Changelog data is now consistent and accurate
- **User Experience**: Screenshots for same-day updates won't overwrite each other
- **Code Quality**: Removed deprecated code, cleaner repository structure
