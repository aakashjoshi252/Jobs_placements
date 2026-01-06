# Repository Cleanup Guide

## 🗑️ Files to Delete

These files are either duplicates, examples, or documentation that can be safely removed to keep your repository clean.

---

## Files to DELETE:

### 1. **Duplicate/Example Configuration Files**

```bash
# These are example files - you already have the actual files
server/.env.production.example      # DELETE - You have .env.production
server/package.json.example         # DELETE - You have package.json
```

### 2. **Sensitive Files (Should NOT be in Git)**

```bash
# CRITICAL: These contain secrets and should be in .gitignore
server/.env                         # DELETE from Git (keep locally)
server/.env.production             # DELETE from Git (keep locally)
```

### 3. **Excessive Documentation Files Created Today**

```bash
# Keep only essential docs, delete the rest
CLOUDINARY_FIX.md                  # DELETE - Issue is fixed
FIXES_APPLIED.md                   # DELETE - Can be in commit history
server/SECURITY_SETUP.md           # DELETE - Can merge into main README
```

### 4. **Node Modules (Should NEVER be in Git)**

```bash
server/node_modules/               # DELETE - Should be in .gitignore
```

### 5. **Uploads Folder (User-generated content)**

```bash
server/uploads/                    # DELETE from Git (regenerated locally)
```

---

## ✅ Files to KEEP:

### Essential Configuration
- ✅ `server/.env.example` - Template for other developers
- ✅ `server/.dockerignore` - Docker configuration
- ✅ `server/.eslintrc.js` - Code linting
- ✅ `server/.prettierrc` - Code formatting
- ✅ `server/Dockerfile` - Docker deployment
- ✅ `server/ecosystem.config.js` - PM2 configuration
- ✅ `server/package.json` - Dependencies
- ✅ `server/package-lock.json` - Locked dependencies

### Essential Directories
- ✅ `server/config/` - App configuration
- ✅ `server/constants/` - Constants
- ✅ `server/controllers/` - Business logic
- ✅ `server/middlewares/` - Middleware functions
- ✅ `server/models/` - Database models
- ✅ `server/routes/` - API routes
- ✅ `server/scripts/` - Utility scripts
- ✅ `server/tests/` - Test files
- ✅ `server/utils/` - Helper functions
- ✅ `server/server.js` - Main entry point

---

## 🔧 Quick Cleanup Commands

### Run these commands from your project root:

```bash
# 1. Delete example files
git rm server/.env.production.example
git rm server/package.json.example

# 2. Delete sensitive files from Git (keep local copies first!)
# IMPORTANT: Copy these files to a safe place first!
cp server/.env server/.env.backup
cp server/.env.production server/.env.production.backup

git rm --cached server/.env
git rm --cached server/.env.production

# 3. Delete documentation files
git rm CLOUDINARY_FIX.md
git rm FIXES_APPLIED.md
git rm server/SECURITY_SETUP.md

# 4. Delete node_modules from Git (if accidentally committed)
git rm -r --cached server/node_modules

# 5. Delete uploads folder from Git
git rm -r --cached server/uploads

# 6. Commit the cleanup
git commit -m "chore: Clean up unnecessary files and sensitive data"

# 7. Push changes
git push origin main
```

---

## 📝 Update .gitignore

Make sure your `.gitignore` has these entries:

```gitignore
# Environment files
.env
.env.local
.env.production
.env.*.local

# Dependencies
node_modules/

# Uploads
uploads/

# Logs
logs/
*.log

# Testing
coverage/

# Build
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## 🔒 Security Best Practices

### After Cleanup:

1. **Rotate All Secrets** - Since `.env` and `.env.production` were in Git:
   ```bash
   # Change these immediately:
   - JWT_SECRET
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - MONGO_URL (if using cloud database)
   ```

2. **Update Environment Variables**:
   - Local: Update `server/.env`
   - Production: Update environment variables in your hosting platform

3. **Verify .gitignore**:
   ```bash
   git status
   # Should NOT show .env files or node_modules
   ```

---

## 📊 Before vs After

### Before Cleanup:
```
├── server/
│   ├── .env ❌ (sensitive)
│   ├── .env.production ❌ (sensitive)
│   ├── .env.production.example ❌ (duplicate)
│   ├── package.json.example ❌ (duplicate)
│   ├── node_modules/ ❌ (shouldn't be in Git)
│   ├── uploads/ ❌ (user content)
├── CLOUDINARY_FIX.md ❌ (temporary doc)
├── FIXES_APPLIED.md ❌ (temporary doc)
└── SECURITY_SETUP.md ❌ (temporary doc)
```

### After Cleanup:
```
├── server/
│   ├── .env.example ✅ (template only)
│   ├── .eslintrc.js ✅
│   ├── .prettierrc ✅
│   ├── Dockerfile ✅
│   ├── ecosystem.config.js ✅
│   ├── package.json ✅
│   ├── package-lock.json ✅
│   ├── server.js ✅
│   ├── config/ ✅
│   ├── controllers/ ✅
│   ├── middlewares/ ✅
│   ├── models/ ✅
│   ├── routes/ ✅
│   ├── scripts/ ✅
│   ├── tests/ ✅
│   └── utils/ ✅
├── README.md ✅
├── .gitignore ✅ (updated)
└── CLEANUP_GUIDE.md ✅ (this file - can delete after cleanup)
```

---

## ⚡ Quick One-Line Cleanup

**WARNING: Review each command before running!**

```bash
# Delete all unnecessary files in one go
git rm server/.env.production.example server/package.json.example CLOUDINARY_FIX.md FIXES_APPLIED.md server/SECURITY_SETUP.md && \
git rm --cached server/.env server/.env.production && \
git rm -r --cached server/node_modules server/uploads && \
git commit -m "chore: Clean up repository - remove sensitive files, duplicates, and temporary docs" && \
git push origin main
```

---

## ✅ Verification Checklist

After cleanup:

- [ ] No `.env` files in Git (except `.env.example`)
- [ ] No `node_modules/` in Git
- [ ] No `uploads/` in Git
- [ ] No duplicate example files
- [ ] No temporary documentation files
- [ ] `.gitignore` updated
- [ ] All secrets rotated
- [ ] Local `.env` file still exists (not committed)
- [ ] `npm install` works correctly
- [ ] Server starts without errors

---

## 🚨 Important Notes

1. **Before deleting** `.env` and `.env.production` from Git, **make sure you have backup copies**!

2. **After removing sensitive files from Git**, they're still in commit history. To completely remove them:
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   # WARNING: This rewrites history!
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch server/.env server/.env.production" \
   --prune-empty --tag-name-filter cat -- --all
   ```

3. **Change all secrets** immediately after removing them from Git

4. **This guide can be deleted** after you've completed the cleanup

---

## 📞 Need Help?

If you're unsure about deleting any file, check:
1. Is it in `.gitignore`?
2. Can it be regenerated (node_modules, uploads)?
3. Does it contain secrets (.env files)?
4. Is it a duplicate (example files)?

When in doubt, **keep it** and ask for clarification!

---

**Created:** January 6, 2026  
**Purpose:** Clean up Jobs_placements repository  
**Status:** Ready for execution
