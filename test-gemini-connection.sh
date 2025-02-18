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
        -H "x-goog-api-key: ${GEMINI_API_KEY}" \
        "${BASE_URL}/models" | jq '.'
}

# Function to test a specific model with a custom prompt
test_model() {
    local MODEL=$1
    local MODEL_TYPE=$2
    local PROMPT=$3
    
    echo "Testing ${MODEL_TYPE} (${MODEL})..."
    echo "Prompt: ${PROMPT}"
    
    local RESPONSE=$(curl -s -X POST \
        -H "x-goog-api-key: ${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"contents\": [{
                \"parts\":[{
                    \"text\": \"${PROMPT}\"
                }]
            }]
        }" \
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

# Test flash thinking model with a complex reasoning task
echo "Testing Flash Thinking Model with Complex Task..."
test_model "$GEMINI_REASONING_MODEL" "Flash Thinking Model" "Design a step-by-step process for optimizing a battery manufacturing line. Consider efficiency, quality control, and safety measures."

# Test pro vision model with an analytical question
echo "Testing Pro Vision Model with Analytical Question..."
test_model "$GEMINI_VISION_MODEL" "Pro Vision Model" "Analyze the key components of a lithium-ion battery and explain how they work together to store and release energy."

echo "Testing complete!"
echo "If you see valid JSON responses above, your API key is working correctly."
echo "If you see error messages, please check your API key and try again."
