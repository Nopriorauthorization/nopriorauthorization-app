#!/bin/bash
# Script to set Vercel environment variables for production

echo "🔧 Setting Vercel Production Environment Variables..."
echo ""

# Function to add environment variable
add_env() {
  local name=$1
  local value=$2
  echo "Adding $name..."
  echo "$value" | npx vercel env add "$name" production --force
}

# CRITICAL VARIABLES
add_env "NEXTAUTH_SECRET" "E77jV3nbqHRVE4negvcmcsC7f0oXiOLvE9RhyEQM+z8="
add_env "NEXTAUTH_URL" "https://nopriorauthorization.com"
add_env "DATABASE_URL" "postgresql://postgres.afjowaoukxcrwekvhbik:Alcaladani0912@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
add_env "DIRECT_URL" "postgresql://postgres:Alcaladani0912@db.afjowaoukxcrwekvhbik.supabase.co:5432/postgres"

# OPTIONAL VARIABLES
add_env "OPENAI_API_KEY" "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"

echo ""
echo "✅ Environment variables set successfully!"
echo "🚀 Triggering production deployment..."
npx vercel --prod --yes
