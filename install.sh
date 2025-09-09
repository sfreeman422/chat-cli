#!/bin/bash

# Chat CLI Installation Script

echo "🚀 Installing chat-cli..."

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install curl first."
    echo "   Ubuntu/Debian: sudo apt-get install curl"
    echo "   macOS: brew install curl (usually pre-installed)"
    echo "   CentOS/RHEL: sudo yum install curl"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq is not installed. Please install jq first."
    echo "   Ubuntu/Debian: sudo apt-get install jq"
    echo "   macOS: brew install jq"
    echo "   CentOS/RHEL: sudo yum install jq"
    exit 1
fi

echo "✅ Dependencies (curl, jq) are installed!"

# Make chat script executable
chmod +x chat

# Install globally (optional)
read -p "🌍 Do you want to install chat-cli globally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 Installing globally..."
    
    # Check if we can write to /usr/local/bin
    if [ -w "/usr/local/bin" ] || sudo -n true 2>/dev/null; then
        if [ -w "/usr/local/bin" ]; then
            cp chat /usr/local/bin/chat
        else
            sudo cp chat /usr/local/bin/chat
        fi
        echo "✅ chat-cli installed globally! You can now use 'chat' from anywhere."
    else
        echo "⚠️  Cannot install globally without sudo permissions."
        echo "   Run with sudo or add the current directory to your PATH:"
        echo "   export PATH=\$PATH:$(pwd)"
        echo "   Add this to your shell profile (~/.bashrc, ~/.zshrc) to persist."
    fi
else
    echo "ℹ️  To use chat-cli, run: ./chat"
    echo "   Or add this directory to your PATH: export PATH=\$PATH:$(pwd)"
fi

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo
    echo "⚠️  OpenAI API key not found!"
    echo "📝 Please set your OpenAI API key:"
    echo "   export OPENAI_API_KEY=\"your-api-key-here\""
    echo
    echo "💡 Add this to your shell profile (~/.bashrc, ~/.zshrc) to persist:"
    echo "   echo 'export OPENAI_API_KEY=\"your-api-key-here\"' >> ~/.bashrc"
    echo
    echo "🔗 Get your API key from: https://platform.openai.com/api-keys"
else
    echo "✅ OpenAI API key found!"
fi

echo
echo "🎉 Installation complete!"
echo
echo "📖 Usage:"
echo "   chat \"your message here\""
echo "   chat new"