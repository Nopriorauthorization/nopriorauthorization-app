#!/bin/bash

# List of files to fix
files=(
    "src/app/(dashboard)/appointment-prep/page.tsx"
    "src/app/(dashboard)/chat/page.tsx" 
    "src/app/settings/page.tsx"
    "src/app/vault/settings/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Remove existing "use client" and dynamic lines
        sed -i '' '/^"use client";$/d' "$file"
        sed -i '' '/^export const dynamic = "force-dynamic";$/d' "$file"
        
        # Add them at the top in correct order
        sed -i '' '1i\
"use client";\
export const dynamic = "force-dynamic";\
' "$file"
    fi
done

echo "Fixed client directives in all files"
