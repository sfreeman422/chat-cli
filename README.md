# chat-cli

A simple command-line interface for chatting with ChatGPT. This tool allows you to have continuous conversations with OpenAI's ChatGPT directly from your terminal.

## Features

- 🗣️ **Continuous conversations**: Maintains conversation context across multiple messages
- 🔄 **New conversation support**: Start fresh conversations anytime
- 🔐 **Environment-based authentication**: Uses OpenAI API key from environment variables
- 💾 **Conversation persistence**: Saves conversation history locally
- ⚡ **Simple usage**: Easy-to-remember commands

## Installation

1. Clone this repository:
```bash
git clone https://github.com/sfreeman422/chat-cli.git
cd chat-cli
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenAI API key:
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

4. (Optional) Install globally for system-wide access:
```bash
npm install -g .
```

## Usage

### Ask a question
```bash
chat "where is the nearest pub"
```

### Start a new conversation
```bash
chat new
```

### Examples
```bash
# Ask a question
chat "What's the weather like today?"

# Continue the conversation
chat "What about tomorrow?"

# Start a fresh conversation
chat new

# Ask a new question
chat "Explain quantum computing in simple terms"
```

## Configuration

The tool requires an OpenAI API key to function. Set the `OPENAI_API_KEY` environment variable:

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export OPENAI_API_KEY="your-openai-api-key-here"
```

You can get an API key from [OpenAI's website](https://platform.openai.com/api-keys).

## Features

- **Conversation History**: Conversations are saved in `~/.chat-cli-state.json`
- **Error Handling**: Proper error messages for API issues, rate limits, and missing API keys
- **Conversation Context**: Each message maintains the full conversation context
- **Fresh Conversations**: Use `chat new` to start over

## Requirements

- Node.js (version 14 or higher)
- OpenAI API key
- Internet connection

## License

ISC