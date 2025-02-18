#!/bin/bash

# Note: Ensure GEMINI_REASONING_MODEL is set in your environment
# Example: export GEMINI_REASONING_MODEL=gemini-2.0-flash-thinking-exp-01-21

# Configure Aider with dual model setup
aider --architect ${GEMINI_REASONING_MODEL} \
      --editor-model claude-3-5-sonnet-20241022 \
      --api-key google=$GEMINI_API_KEY \
      --anthropic-api-key $CLAUDE_API_KEY \
      --model-settings-file "./model_config.yml" \
      --gui \
      --browser-port 8080 \
      --repo-visualizer depth=3 \
      --map-tokens 25000 \
      --map-refresh auto \
      --context-strategy hierarchical
