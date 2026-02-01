#!/bin/bash

# Find all page.tsx files that don't have force-dynamic
find src/app -name "page.tsx" -exec grep -L "force-dynamic" {} \; | while read -r file; do
  echo "Adding dynamic export to $file"
  # Create temp file with export
  echo "export const dynamic = 'force-dynamic';" > /tmp/dynamic_header.txt
  # Combine header with original file
  cat /tmp/dynamic_header.txt "$file" > /tmp/temp_file.txt
  # Replace original file
  mv /tmp/temp_file.txt "$file"
done

echo "Done adding dynamic exports"
