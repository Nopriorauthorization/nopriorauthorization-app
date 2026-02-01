#!/bin/bash

# Find all page.tsx files that have both "use client" and "force-dynamic"
find src/app -name "page.tsx" -exec grep -l "use client" {} \; | while read -r file; do
  if grep -q "force-dynamic" "$file"; then
    echo "Fixing order in $file"
    # Read the file
    content=$(cat "$file")
    # Remove the dynamic export line
    content=$(echo "$content" | sed '/export const dynamic = '\''force-dynamic'\'';/d')
    # Add dynamic export after "use client"
    echo "$content" | sed '/"use client";/a\
export const dynamic = '\''force-dynamic'\'';' > "$file"
  fi
done

echo "Done fixing client directive order"
