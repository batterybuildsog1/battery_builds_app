#!/usr/bin/env bash

# To use this script:
# 1. Make it executable: chmod +x test-gemini-connection.sh
# 2. Run it: ./test-gemini-connection.sh

# Note: This script uses GEMINI_API_KEY for authentication.
# No project ID is required as authentication is handled solely through the API key.

# Check if .env.local exists and source it
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found"
    exit 1
fi

source .env.local

# Check if required environment variables are set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "Error: GEMINI_API_KEY is not set in .env.local"
    exit 1
fi

if [ -z "$GEMINI_REASONING_MODEL" ] || [ -z "$GEMINI_VISION_MODEL" ]; then
    echo "Error: GEMINI_REASONING_MODEL or GEMINI_VISION_MODEL is not set in .env.local"
    exit 1
fi

# Define base URL for API requests
BASE_URL="https://generativelanguage.googleapis.com/v1beta"

# Function to list available models
list_models() {
    echo "Fetching available models..."
    curl -s -X GET \
        -H "Authorization: Bearer ${GEMINI_API_KEY}" \
        "${BASE_URL}/models" | jq '.'
}

# Function to test a specific model
test_model() {
    local MODEL=$1
    local MODEL_TYPE=$2
    
    echo "Testing ${MODEL_TYPE} (${MODEL})..."
    local RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer ${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{"contents":[{"parts":[{"text":"Test response"}]}]}' \
        "${BASE_URL}/models/${MODEL}:generateContent")
    
    echo "${MODEL_TYPE} Response:"
    echo "$RESPONSE" | jq '.'
    echo "--------------------------------"
}

echo "Testing Gemini API Connection..."
echo "--------------------------------"

# List available models
list_models
echo "--------------------------------"

# Test reasoning model
test_model "$GEMINI_REASONING_MODEL" "Reasoning Model"

# Test vision model
test_model "$GEMINI_VISION_MODEL" "Vision Model"

echo "Testing complete!"
