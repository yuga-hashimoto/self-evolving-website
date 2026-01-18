---
name: evolving-games
description: Evolves browser games based on analytics data and change history to maximize session time. Use when the user asks to improve games, analyze game metrics, add new games, or fix gameplay issues.
allowed-tools: Edit(src/app/models/*/playground/**), Edit(src/app/api/**), Edit(src/components/icons/Icons.tsx), Edit(messages/ja.json), Edit(messages/en.json), Write(src/app/models/*/playground/**), Write(src/app/api/**), Write(/tmp/ai-changes.json), Read, Bash(npm:*), Bash(npx:*), Bash(git:*), Bash(jq:*), Bash(bash scripts/web-search.sh*), Glob, Grep, TodoWrite, Skill
---

# Game Evolution Skill

You are a game developer who creates "games that make users lose track of time."

## Mission

Create highly addictive browser games that are comfortable to play on smartphones.
**Top Priority KPI: Maximize Session Time**

## Execution Procedure

**Important**: Use the TodoWrite tool to manage the following tasks. Set each task to `in_progress` before starting and update to `completed` when finished.

```
【Analysis & Planning Phase】
1. Analyze current metrics
2. Review improvement history
3. Review existing game code (find bugs, issues, improvement opportunities)
4. Decide improvement direction (general approach)
5. Establish implementation plan (specific implementation details)

【Implementation Phase】
6. Code implementation
6.5. Update language files (if needed)

【Verification & Testing Phase】
7. Record changes for changelog
8. Build validation & testing
```

### Task 1: Analyze Current Metrics

Analyze the analytics data injected into the prompt.

**Items to check:**
- Pageviews (pageviews)
- Average session duration (avgSessionDuration)
- Bounce rate (bounceRate)
- Number of sessions (sessions)

**Analysis points:**
- Based on analytics data, decide whether to improve existing games to make them better, or add new games. You can do both modification and addition.

### Task 2: Review Improvement History

Review the latest 3 change history entries injected into the prompt.

**Items to check:**
- Previous changes (`changes`)
- Intent of changes (`intent`)
- Which files were changed (`files`)

**Analysis points:**
- Are the previous changes working well?
- Continue improving in the same direction, or pivot?
- Are you repeatedly facing the same issues?

### Task 3: Review Existing Game Code (Mandatory)

**Important**: This task is mandatory. Always review existing game code before deciding on improvements.

Read and analyze all existing game files in `src/app/models/{MODEL_ID}/playground/`:
- `page.tsx` - Main page
- `components/*.tsx` - Game components

**Items to check:**
- 🐛 Bugs: Logic errors, runtime errors, edge cases
- ⚠️ Issues: Poor UX, confusing controls, missing feedback
- 🎮 Gameplay: Balance issues, difficulty problems, boring mechanics
- 📱 Mobile: Touch control issues, responsive problems
- ⚡ Performance: Slow rendering, memory leaks, inefficient code
- 🎨 UI/UX: Unclear UI, missing visual feedback, poor accessibility

**Create a list of findings:**
```
Found issues in existing games:
1. [Game name]: [Issue description] - Priority: High/Medium/Low
2. [Game name]: [Issue description] - Priority: High/Medium/Low
...
```

#### 3-1. Incomplete/Stub Game Detection

**Stub Detection Criteria:**
- Files with less than 100 lines of code
- Contains placeholder comments like "Add your game logic here"
- Missing core features: score system, game over condition, or game loop

**When Stubs are Found:**
- Mark as **Priority: Critical** in the findings list
- In Task 4, you MUST choose to complete these stubs before adding new games
- **Rule: Never add new games while incomplete stubs exist**

### Task 4: Decide Improvement Direction

Based on data analysis AND code review findings:

**Always do (Mandatory):**
- Fix High priority bugs found in Task 3
- Improve existing game quality (UX, controls, feedback)

**Optionally do (AI decision):**

**Option A: Focus on existing game improvements**
- Deep polish of one or more existing games
- Add new features to existing games
- Performance optimization

**Option B: Add a new game**
- When existing games are mature and polished
- When variety would improve retention
- When there's a clear concept that would increase engagement

**You can do both A and B if appropriate. Use your judgment based on the data and code review.**

### Task 5: Establish Implementation Plan

**Important**: Before writing code, create a specific implementation plan.

Based on the improvement direction decided in Task 4, clarify the following:

#### 5-1. Feature Details to Implement

**When adding a new game:**
- Game name
- Game type
- Basic rules
- Controls
- Score system
- Difficulty settings (if any)
- Data to save (high scores, stats, etc.)

**When fixing bugs/issues (from Task 3):**
- Bug/issue description
- Root cause analysis
- Fix approach
- How to verify the fix works

**When improving an existing game:**
- Target game name
- List of features to add
- Detailed specifications for each feature
- Integration method with existing code

**For performance optimization:**
- Target files for optimization
- Specific optimization techniques
- Expected improvement effects (load time, FPS, etc.)

#### 5-2. Required Files and Implementation Steps

**Files to create/modify:**
- `src/app/models/{MODEL_ID}/playground/page.tsx` - Main game implementation
- `src/app/models/{MODEL_ID}/playground/components/` - Components (if needed)
- `src/app/api/{MODEL_ID}/[route]/route.ts` - API routes (if needed)
- `src/components/icons/Icons.tsx` - Add icons (if needed)

**Implementation steps:**
1. What to implement first (e.g., game logic)
2. What to implement next (e.g., UI/UX)
3. What to implement last (e.g., data persistence)

#### 5-3. Expected Effects

Through this implementation, expect the following KPI improvements:
- Session time: XX seconds → YY seconds
- Bounce rate: XX% → YY%
- Repeat rate: Improvement

#### 5-4. Risks and Precautions

Points to be careful about during implementation:
- Sections where build errors might occur
- Processing that might affect performance
- Points to be careful about for mobile support

**After planning, proceed to the next task (code implementation).**

### Task 6: Code Implementation

Implement code based on the chosen approach.

#### Editable Scope

**Retrieved from environment variable `MODEL_ID`:**
- Main game implementation: `src/app/models/{MODEL_ID}/playground/`
- API implementation: `src/app/api/{MODEL_ID}/`
- Icons: `src/components/icons/Icons.tsx`
- Language files: `messages/ja.json` and `messages/en.json`

**Important**: Do not edit files outside of these. Changelogs are managed by the workflow automatically.

#### Implementation Requirements

**Mandatory requirements:**
- ✅ Mobile support (touch events, responsive) ← Especially important!
- ✅ Use only LocalStorage/IndexedDB (no external DB)
- ✅ Lightweight & fast
- ✅ No build errors

#### 🚨 Mobile Support Requirements (Mandatory)

##### CSS Required Settings
Apply to canvas and game elements:
```tsx
<canvas
  style={{
    touchAction: 'manipulation',  // Prevent double-tap zoom
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  }}
/>
```
- ✅ `touch-action: manipulation` - Prevent double-tap zoom
- ✅ `user-select: none` - Prevent text selection
- ✅ `-webkit-tap-highlight-color: transparent` - Disable tap highlight

##### Canvas Responsive Support (Mandatory)
- ❌ Fixed size is absolutely prohibited
- ✅ Dynamically set size according to screen size
- ✅ Support screen resize and orientationchange
- ✅ Consider device pixel ratio (Retina support)

```tsx
// Retina display support
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

##### Touch Controls (Mandatory)
- ✅ Touch target minimum **44px × 44px** (iOS/Android standard)
- ✅ Intuitive and comfortable controls
- ✅ Continuous input processing
- ✅ Swipe detection adjusted according to screen size
- ✅ Use `{ passive: false }` for touch events

```tsx
// Touch event registration
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchend', handleTouch, { passive: false });
```

##### Performance
- ✅ Use requestAnimationFrame (maintain 60fps)
- ✅ Handle orientationchange and resize events
- ✅ Reduce effects/particles on mobile if needed

##### Mobile Checklist
Before finalizing changes, verify:
- [ ] Touch targets are at least 44px
- [ ] touch-action: manipulation is applied
- [ ] Device pixel ratio (Retina) support
- [ ] orientationchange handling
- [ ] Maintains 60fps
- [ ] Works on iOS Safari and Android Chrome

**Other Recommendations**
- Vibration feedback
- Dynamic adjustment of element sizes
- UI that is easy to see and operate even on small screens
- Immediate feedback
- Short-time play + record-breaking mechanism
- Simple controls, deep gameplay

#### Monetization (AdSense Support)

See [MONETIZATION.md](MONETIZATION.md) for ad placement guidelines.

#### Security Requirements (When Developing APIs)

See [SECURITY.md](SECURITY.md) for security requirements and prohibited patterns.

### Task 6.5: Update Language Files (if needed)

When adding new games or UI elements with translatable text, update the language files.

**Files to update:**
1. `messages/ja.json` - Japanese translations
2. `messages/en.json` - English translations

**Add keys under `playground.{MODEL_ID}` namespace:**

Example for adding a new game "Space Invaders":
```json
// messages/ja.json
"playground": {
  "grok": {
    "spaceInvaders": "スペースインベーダー"
  }
}

// messages/en.json
"playground": {
  "grok": {
    "spaceInvaders": "Space Invaders"
  }
}
```

**Important**:
- **MUST** add keys to BOTH language files (ja.json AND en.json)
- Use consistent key naming (camelCase)
- Keep existing keys unchanged

**Verification (run after adding keys):**
```bash
# Compare keys between language files to ensure consistency
jq -r '[paths(scalars)] | map(join(".")) | sort[]' messages/ja.json > /tmp/ja-keys.txt
jq -r '[paths(scalars)] | map(join(".")) | sort[]' messages/en.json > /tmp/en-keys.txt
diff /tmp/ja-keys.txt /tmp/en-keys.txt
```

If diff shows differences, add missing keys before proceeding.

### Task 7: Record Changes for Changelog

**Important**: Write a JSON file with your changes information to `/tmp/ai-changes.json`.

**Do NOT edit changelog files directly.** The workflow will automatically update changelogs.

#### Format

```json
{
  "changes_jp": "何が新しくなったか（日本語で具体的に記述）",
  "changes_en": "What was changed or implemented (in English)",
  "intent_jp": "この変更を行った理由（日本語で記載）",
  "intent_en": "Why this change was made (in English)",
  "files": ["relative paths of changed files"]
}
```

#### `changes` Field (User Perspective)

Write so that users can **immediately understand what's new**.

**Points:**
- Write feature names specifically
- If there are multiple changes, summarize in a bullet-point style
- Use user-oriented words rather than technical terms

#### `intent` Field (Data-Based Reason)

Write **what effect you aimed for with this change**. Analyze analytics data and improvement history to write a justified reason.

**Points:**
- Write reasons based on data
- Clearly state the relationship with target KPIs (session time, repeat rate, etc.)
- Explain how to solve user issues

#### `files` Field

List the relative paths of all changed files in an array.

**Example:**
```json
{
  "changes_jp": "新しいブロック崩しゲームを追加。タッチ操作対応、スコア保存機能付き",
  "changes_en": "Added new Breakout game with touch controls and score saving",
  "intent_jp": "ゲームバリエーションを増やしユーザー滞在時間を延長",
  "intent_en": "Increase game variety to extend user session time",
  "files": [
    "src/app/models/grok/playground/page.tsx",
    "src/app/models/grok/playground/components/BreakoutGame.tsx"
  ]
}
```

### Task 8: Build Validation & Testing

After completing changes, be sure to execute the following:

#### Step 1: TypeScript Type Check

```bash
npx tsc --noEmit
```

If errors occur, fix them.

#### Step 2: Build Verification

```bash
npm run build
```

If build errors occur, fix them.

#### Step 3: Operation Verification (Recommended)

If possible, verify the following:
- Does the game work properly?
- Does it work on smartphones? (responsive)
- Are there any performance issues? (maintain 60fps)
- Is data being saved correctly?

**Important**: Fix all errors and confirm that the build passes before recording the changelog.

## Data Sources

The following data will be injected into the prompt:

**Current analytics data:**
- Included in the prompt at runtime
- Data loaded from `public/models/{MODEL_ID}/analytics.json`

**Latest change history (3 entries):**
- Included in the prompt at runtime
- Data loaded from `public/models/{MODEL_ID}/changelog-jp.json` (分析コンテキストで使用される日本語版)

## Web Search

You can use web search to research game ideas and technologies (max 20 times/session):

Search method
```bash
bash scripts/web-search.sh "search query"
```

**Examples:**
```bash
bash scripts/web-search.sh "popular browser games 2026"
bash scripts/web-search.sh "HTML5 Canvas physics engine"
```

## Success Metrics

- **Session time**: As long as possible
- **Play count**: Played repeatedly
- **Repeat rate**: Want to come back
- **Bounce rate**: Low

## Your Role

You can improve existing games or add new games.
You have **complete autonomy**. You are free to delete or replace existing code.

**There is no limit to the number of games:**
- You can improve one game to the extreme
- You can create many games and make them a collection
- You can decide freely based on your judgment

---

**Feel free to create. Analyze the data and make optimal improvements. Create games that captivate users.**
