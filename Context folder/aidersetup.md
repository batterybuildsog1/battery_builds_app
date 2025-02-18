aidersetup

Configuring Aider for Advanced Pair Programming with Gemini and Claude
Executive Summary
This technical guide outlines the configuration of Aider v0.35 for advanced AI-assisted development using Gemini 2.0 Flash (Thinking Expanded) as the architect model and Claude 3.5 Sonnet as the editor model. The configuration addresses multi-model integration, context management, and workflow optimization based on IndyDevDan's proven methodologies125. Key features include:

Dual-model architecture with 1M token context for Gemini

Output token limits optimized for code quality (8K Claude/12K Gemini)

Browser-based interface with repo-aware development

Automated git integration with safety controls

Architectural Configuration
Model Specification
bash
# First, ensure your .env.local contains the required model names:
# GEMINI_REASONING_MODEL=your-gemini-model-name
# CLAUDE_MODEL=your-claude-model-name

aider --architect $GEMINI_REASONING_MODEL \
      --editor-model $CLAUDE_MODEL \
      --api-key google=your_gemini_key \
      --api-key anthropic=your_claude_key \
      --model-settings-file ~/.aider/model_config.yml
Key Configuration Parameters
Parameter	Gemini Value	Claude Value
Max Output Tokens	12,000	8,000
Context Window	1,000,000	200,000
Temperature	0.3	0.2
Reasoning Effort	High	Medium
Auto-Context Refresh	Every 5 Changes	Manual
Implementation Details
Environment Configuration
Before proceeding with the implementation, ensure you have created a `.env.local` file in your project root with the following variables:
```env
GEMINI_REASONING_MODEL=your-gemini-model-name
CLAUDE_MODEL=your-claude-model-name
```

Model Configuration File (~/.aider/model_config.yml)
text
models:
  # Use the model name from GEMINI_REASONING_MODEL in .env.local
  ${GEMINI_REASONING_MODEL}:
    max_output_tokens: 12000
    reasoning_effort: 3
    top_k: 40
    context_management: dynamic
    
  # Use the model name from CLAUDE_MODEL in .env.local
  ${CLAUDE_MODEL}:
    max_output_tokens: 8000
    temperature: 0.2
    stop_sequences: ["\n\nHuman:", "\n\nAssistant:"]
Browser Interface Activation
Enable Chromium-based GUI with repo visualization:

bash
aider --gui --browser-port 8080 --repo-visualizer depth=3
Access at http://localhost:8080 with live codebase visualization325

Workflow Optimization
IndyDevDan Methodology Implementation
Context Management

bash
aider --map-tokens 25000 --map-refresh auto --context-strategy hierarchical
Automated Quality Controls

bash
aider --auto-lint --lint-cmd "flake8 --max-line-length=120" \
      --auto-test --test-cmd "pytest -v" \
      --quality-gate 95
Advanced Scripting Example
python
from aider.coders import ArchitectCoder
from aider.models import GeminiModel, ClaudeModel

# Import for environment variables
import os

gemini = GeminiModel(
    model=os.getenv('GEMINI_REASONING_MODEL'),  # Set in .env.local
    api_key="your_key",
    max_output_tokens=12000
)

claude = ClaudeModel(
    model=os.getenv('CLAUDE_MODEL'),  # Set in .env.local
    api_key="your_key",
    max_output_tokens=8000
)

architect = ArchitectCoder(
    main_model=gemini,
    editor_model=claude,
    repo_path="/path/to/repo",
    auto_commit=True
)

response = architect.run(
    "Implement OAuth2 authentication flow following security best practices",
    context_files=["security_policies.md", "existing_auth.py"]
)
