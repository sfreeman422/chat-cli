# chat-cli

A simple command-line interface for chatting with ChatGPT. This tool allows you to have continuous conversations with OpenAI's ChatGPT directly from your terminal using pure Bash.

## Features

- 🗣️ **Continuous conversations**: Maintains conversation context across multiple messages
- 📝 **Multiple conversations**: Create and manage multiple named conversations
- 🔍 **Conversation history**: List and search through previous conversations
- 🔄 **New conversation support**: Start fresh conversations with optional titles
- 💾 **Load previous conversations**: Resume any previous conversation by title or ID
- 🏷️ **Conversation management**: Save conversations with custom titles
- 🔐 **Environment-based authentication**: Uses OpenAI API key from environment variables
- 💾 **Conversation persistence**: Saves all conversations locally with metadata
- ⚡ **Simple usage**: Easy-to-remember commands
- 🐚 **Pure Bash**: No Node.js dependency - works with standard Unix tools

## Requirements

- **curl** - for making HTTP requests to OpenAI API
- **jq** - for JSON processing
- **OpenAI API key** - for accessing ChatGPT

## Installation

1. Clone this repository:
```bash
git clone https://github.com/sfreeman422/chat-cli.git
cd chat-cli
```

2. Install dependencies:
```bash
# Ubuntu/Debian
sudo apt-get install curl jq

# macOS (using Homebrew)
brew install curl jq

# CentOS/RHEL
sudo yum install curl jq
```

3. Set up your OpenAI API key:
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

4. Run the installation script:
```bash
./install.sh
```

This will check dependencies and optionally install the `chat` command globally.

## Usage

### Ask a question
```bash
chat "where is the nearest pub"
```

### Start a new conversation
```bash
chat new
# or with a custom title
chat new "Python Help Session"
```

### List all previous conversations
```bash
chat list
```

### Load and continue a previous conversation
```bash
chat load "Python Help Session"
# or by partial title match
chat load "python"
```

### Save current conversation with a new title
```bash
chat save "My Important Discussion"
```

### Complete workflow examples
```bash
# Start a conversation with a title
chat new "Learning JavaScript"
chat "What are closures in JavaScript?"
chat "Can you give me an example?"

# Save it with a descriptive title
chat save "JavaScript Closures Tutorial"

# Start another conversation
chat new "Recipe Ideas"
chat "Give me a healthy dinner recipe"

# List all conversations
chat list

# Go back to the JavaScript conversation
chat load "JavaScript"
chat "What about arrow functions?"
```

## Configuration

The tool requires an OpenAI API key to function. Set the `OPENAI_API_KEY` environment variable:

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export OPENAI_API_KEY="your-openai-api-key-here"
```

You can get an API key from [OpenAI's website](https://platform.openai.com/api-keys).

## Features

- **Multiple Conversations**: Create and manage multiple named conversations that can be referenced later
- **Conversation History**: List all previous conversations with titles, creation dates, and last updated times
- **Conversation Loading**: Resume any previous conversation by title or ID
- **Auto-titling**: Conversations are automatically titled based on the first message, or you can provide custom titles
- **Conversation Search**: Load conversations by partial title matching (case-insensitive)
- **Conversation Management**: Save current conversations with new titles
- **Legacy Migration**: Automatically migrates old single-conversation format to new multi-conversation structure
- **Conversation Context**: Each message maintains the full conversation context within the selected conversation
- **Fresh Conversations**: Use `chat new` to start over with a clean slate
- **Colorized Output**: Easy-to-read colored terminal output with conversation indicators
- **Error Handling**: Proper error messages for API issues, rate limits, and missing API keys

## Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `chat "message"` | Send a message to ChatGPT | `chat "Explain quantum physics"` |
| `chat new` | Start a new conversation | `chat new` |
| `chat new "title"` | Start a new conversation with title | `chat new "Python Learning"` |
| `chat list` | List all conversations | `chat list` |
| `chat load "title"` | Load conversation by title | `chat load "Python Learning"` |
| `chat load "partial"` | Load by partial title match | `chat load "python"` |
| `chat save "title"` | Save current conversation with new title | `chat save "Important Chat"` |

## Storage

Conversations are stored in `~/.chat-cli/`:
- `conversations/` - Individual conversation files (JSON format)
- `metadata.json` - Conversation metadata (titles, timestamps)
- `current` - Tracks which conversation is currently active

The tool automatically migrates from the old `~/.chat-cli-state.json` format if found.

## Dependencies

- **curl**: For making HTTP requests to the OpenAI API
- **jq**: For JSON parsing and manipulation
- **bash**: Standard on most Unix-like systems

## License

ISC