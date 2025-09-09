#!/bin/bash

# Chat CLI Installation Script

echo "🚀 Installing chat-cli..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install globally (optional)
read -p "🌍 Do you want to install chat-cli globally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 Installing globally..."
    npm install -g .
    echo "✅ chat-cli installed globally! You can now use 'chat' from anywhere."
else
    echo "ℹ️  To use chat-cli, run: node chat.js"
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