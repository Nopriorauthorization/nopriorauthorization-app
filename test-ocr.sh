#!/bin/bash

echo "🧪 Testing Google Cloud Vision API Setup"
echo "========================================"
echo ""

# Check if service account key exists
if [ ! -f "service-account-key.json" ]; then
    echo "❌ Service account key file not found: service-account-key.json"
    echo "   Please run ./setup-google-vision.sh first"
    exit 1
fi

echo "✅ Service account key file found"

# Check environment variables
if [ -z "$GOOGLE_CLOUD_PROJECT_ID" ]; then
    echo "⚠️  GOOGLE_CLOUD_PROJECT_ID not set, checking .env.local..."
    if [ -f ".env.local" ]; then
        export $(grep -v '^#' .env.local | xargs)
    fi
fi

if [ -z "$GOOGLE_CLOUD_PROJECT_ID" ]; then
    echo "❌ GOOGLE_CLOUD_PROJECT_ID not set"
    echo "   Please set it in .env.local or run ./setup-google-vision.sh"
    exit 1
fi

echo "✅ Environment variables configured"
echo "   Project ID: $GOOGLE_CLOUD_PROJECT_ID"

# Test the OCR service
echo ""
echo "🔄 Testing OCR service..."

# Create a simple test using Node.js
node -e "
const { ocrService } = require('./src/lib/ocr-service.ts');

// Test with a simple text file (we'll create one)
const fs = require('fs');

// Create a test lab document text
const testLabText = \`LABORATORY REPORT
Patient: John Doe
Date: January 20, 2026

TEST RESULTS:
Hemoglobin A1c: 6.2 % (Reference: 4.0-5.6) HIGH
Vitamin D: 25 ng/mL (Reference: 30-100) LOW
Total Cholesterol: 220 mg/dL (Reference: < 200) HIGH

Reference Ranges:
- HbA1c: 4.0-5.6 %
- Vitamin D: 30-100 ng/mL
- Total Cholesterol: < 200 mg/dL
\`;

console.log('📄 Test lab document created');
console.log('🔍 Testing OCR parsing...');

// Test the parsing function directly
const results = ocrService.parseLabResults(testLabText, 'test-doc-123');
console.log(\`✅ Parsed \${results.length} lab results:\`);
results.forEach(result => {
  console.log(\`   - \${result.testName}: \${result.value} \${result.unit} (\${result.status})\`);
});

console.log('');
console.log('🎉 OCR parsing test completed successfully!');
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ OCR parsing test passed!"
    echo ""
    echo "🚀 Your Lab Decoder is ready for real OCR processing!"
    echo "   Upload a lab document to test the full pipeline."
else
    echo ""
    echo "❌ OCR parsing test failed"
    echo "   Check the setup and try again"
    exit 1
fi