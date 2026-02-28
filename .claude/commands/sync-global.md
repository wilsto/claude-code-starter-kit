# /sync-global — Bidirectional sync between template and global config

## Purpose

Synchronize syncable files (rules, commands, hooks) between this template repo and `~/.claude/` global config. Bidirectional: detects changes on both sides, shows a report, and applies with user confirmation.

## Algorithm

### Step 1 — Load sync-config.json

Read `.claude/sync-config.json` from this repo to know which files are syncable.

### Step 2 — Load or create sync-manifest.json

Read `~/.claude/sync-manifest.json`. If it doesn't exist, treat all files as NEW.

### Step 3 — Compute hashes and classify changes

For each syncable file category (rules, commands, hooks):

1. Compute SHA-256 of the **template** version (in this repo's `.claude/<category>/`)
2. Compute SHA-256 of the **global** version (in `~/.claude/<category>/`)
3. Compare both to the hashes stored in the manifest
4. Classify:
   - `UNCHANGED` — both match manifest (skip)
   - `NEW` — exists in template but not in global (or vice-versa)
   - `TEMPLATE→GLOBAL` — template hash changed since last sync, global hasn't
   - `GLOBAL→TEMPLATE` — global hash changed since last sync, template hasn't
   - `CONFLICT` — both sides changed since last sync

Use this bash command to compute hashes:
```bash
node -e "const crypto=require('crypto'),fs=require('fs');console.log(crypto.createHash('sha256').update(fs.readFileSync(process.argv[1])).digest('hex'))" "<filepath>"
```

### Step 4 — Check settings.json permissions

Compare `permissions.deny` arrays between:
- Template: `.claude/settings.json`
- Global: `~/.claude/settings.json`

Strategy for deny: **union** (all items from both sides should be present in both).
Strategy for allow: **base-additive** (template base always present in global, global additions preserved).

### Step 5 — Present the sync report

Display a grouped report:

```
Sync Report — Template <-> Global

RULES:
  [NEW]              conventions.md → not in global yet
  [TEMPLATE→GLOBAL]  roles.md — template updated
  [GLOBAL→TEMPLATE]  quality.md — global updated
  [CONFLICT]         workflow.md — both sides changed

COMMANDS:
  [UNCHANGED]        review.md, simplify.md, polaris.md

HOOKS:
  [TEMPLATE→GLOBAL]  session-context.js — template updated

SETTINGS:
  [DENY] 2 new rules in template not in global
  [ALLOW] 3 new entries in global not in template
```

### Step 6 — Resolve with user confirmation

For each group, ask the user:
1. **Apply all** (in the detected direction)
2. **Review one by one** (show diff for each file)
3. **Skip all**

For CONFLICT files: always show a side-by-side diff and let the user choose:
- Keep template version
- Keep global version
- Skip (resolve later)

### Step 7 — Apply changes

- **TEMPLATE→GLOBAL**: Copy template file to `~/.claude/<category>/`
- **GLOBAL→TEMPLATE**: Copy global file to template `.claude/<category>/`, then `git add` the file
- **NEW**: Copy to the other side
- **SETTINGS deny (union)**: Add missing entries to both sides
- **SETTINGS allow**: Add missing template base entries to global

### Step 8 — Update manifest

After all changes are applied, update `~/.claude/sync-manifest.json`:
- Record new hashes for all synced files
- Update `lastSyncDate`
- Record settings state

### Step 9 — Summary

Display what was done:
```
Sync complete:
  - 3 files copied template → global
  - 1 file copied global → template (staged for commit)
  - 2 deny rules added to global settings
  - Manifest updated
```

If any template files were modified (GLOBAL→TEMPLATE), suggest `/commit`.

## File mapping

| Category | Template path | Global path |
| --- | --- | --- |
| rules | `.claude/rules/<file>` | `~/.claude/rules/<file>` |
| commands | `.claude/commands/<file>` | `~/.claude/commands/<file>` |
| hooks | `.claude/hooks/<file>` | `~/.claude/hooks/<file>` |

## Important notes

- **Never auto-apply**: always show the report and wait for user confirmation
- **Never sync project-only files**: check `sync-config.json` projectOnly list
- **Manifest is the source of truth** for detecting which side changed
- **First run**: if no manifest exists, treat everything as NEW and offer to initialize
- The global `~/.claude/rules/python.md` maps to template's `.claude/rules/python-uv.md` (renamed to avoid conflict with stack-specific python.md)
