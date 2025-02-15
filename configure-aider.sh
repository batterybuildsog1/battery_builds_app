#!/bin/bash

# Configure Aider with dual model setup
aider --architect gemini-2.0-flash-thinking-exp \
      --editor-model claude-3.5-sonnet-20241022 \
      --api-key google=$GEMINI_API_KEY \
      --api-key anthropic=$CLAUDE_API_KEY \
      --model-settings-file ~/.aider/model_config.yml \
      --gui \
      --browser-port 8080 \
      --repo-visualizer depth=3 \
      --map-tokens 25000 \
      --map-refresh auto \
      --context-strategy hierarchical
