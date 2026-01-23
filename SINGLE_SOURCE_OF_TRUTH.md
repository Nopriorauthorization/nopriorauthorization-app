# Single Source of Truth Architecture

## Overview
This document outlines the enforced single source of truth architecture for No Prior Authorization, ensuring identical navigation and features between marketing (`nopriorauthorization.com`) and app (`app.nopriorauthorization.com`) surfaces.

## Architecture Model
**Monorepo with Shared Components & Environment-Based Configuration**

- Single Next.js codebase
- Shared components in `src/components/shared/`
- Environment variables control surface-specific behavior
- Separate Vercel deployments with different configs

## Directory Structure
```
src/
├── components/
│   ├── shared/           # Single source of truth components
│   │   ├── navigation-config.ts    # Navigation structure
│   │   └── ...           # Other shared components
│   ├── layout/           # Layout components (use shared config)
│   └── ...               # Feature-specific components
├── app/                  # Next.js app router
│   ├── vault/            # Sacred Vault pages
│   ├── ai-concierge/     # AI Concierge pages
│   └── ...               # Other pages
```

## Deployment Configuration

### Vercel Configs
- `vercel.json` - Default (app mode)
- `vercel-marketing.json` - Marketing site deployment
- `vercel-app.json` - App site deployment

### Environment Variables
- `NEXT_PUBLIC_APP_MODE=marketing` - Marketing site
- `NEXT_PUBLIC_APP_MODE=app` - App site (default)

## Shared Components

### Navigation Config (`src/components/shared/navigation-config.ts`)
```typescript
export const getNavigationConfig = (mode: 'marketing' | 'app' = 'app')
```
- Single source of truth for all navigation items
- Mode-based filtering for surface-specific items
- Type-safe navigation structure

### Usage in Components
```typescript
import { getNavigationConfig } from '@/components/shared/navigation-config'

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || 'app'
const navigationItems = getNavigationConfig(APP_MODE as 'marketing' | 'app')
```

## Deployment Process

### Automated Deployment
```bash
./deploy.sh  # Runs pre-deployment checks, builds, deploys, and verifies
```

### Manual Deployment
```bash
# Marketing site
npx vercel --prod --local-config=vercel-marketing.json

# App site
npx vercel --prod --local-config=vercel-app.json
```

## Quality Assurance

### Pre-deployment Checks
- ✅ TypeScript compilation of shared configs
- ✅ Build success
- ✅ Navigation config validity

### Post-deployment Verification
**MANDATORY: Check both domains after every deployment**

1. **Navigation Identity Check**
   - Visit `https://nopriorauthorization.com`
   - Visit `https://app.nopriorauthorization.com`
   - Compare navigation menus - must be identical

2. **Feature Parity Check**
   - Sacred Vault features must match
   - AI Concierge functionality identical
   - Family Tree features consistent
   - All routes exist on both surfaces

3. **Content Consistency**
   - No feature divergence
   - Coming soon states match
   - Route availability identical

## Rules for Development

### ✅ ALLOWED
- Adding features to shared navigation config
- Using `marketingOnly`/`appOnly` flags for surface-specific items
- Updating shared components
- Environment-based conditional rendering

### ❌ FORBIDDEN
- Different navigation structures
- Surface-specific navigation components
- Feature divergence without explicit flags
- Deploying to only one surface

### Code Review Checklist
- [ ] Navigation changes update shared config
- [ ] New features added to both surfaces or flagged appropriately
- [ ] Shared components used for common functionality
- [ ] Environment variables used for surface-specific behavior

## Emergency Procedures

### If Surfaces Diverge
1. **STOP** all deployments
2. Identify the source of divergence
3. Update shared configs to restore parity
4. Deploy to both surfaces simultaneously
5. Verify both domains match

### Rollback Process
1. Revert the divergent commit
2. Deploy both surfaces with the revert
3. Verify restoration of parity

## Monitoring

### Automated Checks
- Deployment script verifies domain accessibility
- TypeScript compilation ensures config validity

### Manual Monitoring
- Weekly parity checks
- Pre-investor demo verification
- Post-major feature deployment validation

## Why This Matters

### For Investors
- **Trust**: Consistent experience = professional development
- **Scalability**: Shared architecture = maintainable codebase
- **Quality**: Single source of truth = fewer bugs

### For Users
- **Consistency**: Same features regardless of entry point
- **Reliability**: No missing features or broken routes
- **Trust**: Professional, unified product experience

### For Developers
- **Maintainability**: One codebase, one source of truth
- **Velocity**: Faster development with shared components
- **Quality**: Automated checks prevent divergence

## Contact
For questions about this architecture, contact the development team. This is a non-negotiable requirement for maintaining product quality and investor confidence.