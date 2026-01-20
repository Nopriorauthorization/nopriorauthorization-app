#!/bin/bash

echo "🔍 Google Cloud Vision API Setup for Lab Decoder"
echo "=================================================="
echo ""

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ Google Cloud CLI found"

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 > /dev/null; then
    echo "🔐 Please login to Google Cloud:"
    gcloud auth login
fi

echo "✅ Google Cloud authentication confirmed"

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$CURRENT_PROJECT" ] || [ "$CURRENT_PROJECT" = "(unset)" ]; then
    echo "📋 No project set. Please enter your Google Cloud Project ID:"
    read -p "Project ID: " PROJECT_ID
    gcloud config set project $PROJECT_ID
    CURRENT_PROJECT=$PROJECT_ID
fi

echo "✅ Using project: $CURRENT_PROJECT"

# Enable Cloud Vision API
echo "🔄 Enabling Cloud Vision API..."
gcloud services enable vision.googleapis.com --project=$CURRENT_PROJECT

if [ $? -eq 0 ]; then
    echo "✅ Cloud Vision API enabled successfully"
else
    echo "❌ Failed to enable Cloud Vision API"
    exit 1
fi

# Create service account
SERVICE_ACCOUNT_NAME="lab-decoder-ocr"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$CURRENT_PROJECT.iam.gserviceaccount.com"

echo "🔄 Creating service account: $SERVICE_ACCOUNT_NAME"
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --description="Service account for Lab Decoder OCR processing" \
    --display-name="Lab Decoder OCR" \
    --project=$CURRENT_PROJECT

if [ $? -eq 0 ]; then
    echo "✅ Service account created: $SERVICE_ACCOUNT_EMAIL"
else
    echo "⚠️  Service account may already exist, continuing..."
fi

# Grant Vision AI User role
echo "🔄 Granting Vision AI User role to service account..."
gcloud projects add-iam-policy-binding $CURRENT_PROJECT \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/aiplatform.user"

# Grant Storage Object Viewer role (for accessing files)
gcloud projects add-iam-policy-binding $CURRENT_PROJECT \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.objectViewer"

echo "✅ Roles granted to service account"

# Create service account key
KEY_FILE="service-account-key.json"
echo "🔄 Creating service account key..."
gcloud iam service-accounts keys create $KEY_FILE \
    --iam-account=$SERVICE_ACCOUNT_EMAIL \
    --project=$CURRENT_PROJECT

if [ $? -eq 0 ]; then
    echo "✅ Service account key created: $KEY_FILE"
    echo "🔒 IMPORTANT: Keep this file secure and never commit it to version control!"
else
    echo "❌ Failed to create service account key"
    exit 1
fi

# Update environment variables
echo "🔄 Updating environment configuration..."

# Update .env.local with actual project ID
if [ -f ".env.local" ]; then
    # Remove existing GOOGLE_CLOUD_PROJECT_ID line if it exists
    sed -i.bak '/GOOGLE_CLOUD_PROJECT_ID/d' .env.local
    # Add the new project ID
    echo "GOOGLE_CLOUD_PROJECT_ID=$CURRENT_PROJECT" >> .env.local
    echo "✅ Updated GOOGLE_CLOUD_PROJECT_ID in .env.local"
else
    echo "⚠️  .env.local not found, please create it manually with:"
    echo "GOOGLE_CLOUD_PROJECT_ID=$CURRENT_PROJECT"
    echo "GOOGLE_VISION_KEY_FILE=./service-account-key.json"
fi

echo ""
echo "🎉 Google Cloud Vision API setup complete!"
echo ""
echo "📋 Summary:"
echo "   Project ID: $CURRENT_PROJECT"
echo "   Service Account: $SERVICE_ACCOUNT_EMAIL"
echo "   Key File: $KEY_FILE"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the OCR functionality by uploading a lab document"
echo "   2. Check the application logs for OCR processing confirmation"
echo "   3. Monitor Google Cloud Console for API usage"
echo ""
echo "💡 The Lab Decoder will now use real OCR instead of fallback mode!"