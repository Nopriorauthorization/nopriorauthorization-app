#!/bin/bash

# Single Source of Truth Deployment Script
# Ensures both marketing and app surfaces are deployed with identical navigation

set -e

echo "🚀 Starting Single Source of Truth Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if domains are accessible
check_domain() {
    local domain=$1
    local name=$2
    echo -n "Checking $name ($domain)... "

    if curl -s --max-time 10 --head "$domain" | head -n 1 | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ Accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ Not accessible${NC}"
        return 1
    fi
}

# Pre-deployment checks
echo -e "${BLUE}📋 Pre-deployment checks...${NC}"

# Check if navigation config is valid (skip node_modules errors)
if ! npx tsc --noEmit --skipLibCheck src/components/shared/navigation-config.ts; then
    echo -e "${RED}❌ Navigation config has TypeScript errors${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Navigation config is valid${NC}"

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Deploy to production
echo -e "${BLUE}🚀 Deploying to production...${NC}"
npx vercel --prod

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment successful${NC}"

# Post-deployment verification
echo -e "${BLUE}🔍 Post-deployment verification...${NC}"

# Check both domains (you'll need to update these with actual domains)
check_domain "https://nopriorauthorization.com" "Marketing Site"
check_domain "https://app.nopriorauthorization.com" "App Site"

echo ""
echo -e "${YELLOW}⚠️  MANUAL VERIFICATION REQUIRED:${NC}"
echo "   1. Visit https://nopriorauthorization.com"
echo "   2. Visit https://app.nopriorauthorization.com"
echo "   3. Verify navigation menus are identical"
echo "   4. Verify Sacred Vault features match"
echo "   5. Verify all routes exist on both surfaces"
echo ""

echo -e "${GREEN}🎉 Single Source of Truth Deployment Complete!${NC}"
echo "   Both surfaces should now have identical navigation and features."