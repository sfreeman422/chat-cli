#!/usr/bin/env node

const { Command } = require('commander');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const STATE_FILE = path.join(os.homedir(), '.chat-cli-state.json');

class ChatCLI {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.conversationHistory = this.loadConversationHistory();
  }

  loadConversationHistory() {
    try {
      if (fs.existsSync(STATE_FILE)) {
        const data = fs.readFileSync(STATE_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Warning: Could not load conversation history:', error.message);
    }
    return [];
  }

  saveConversationHistory() {
    try {
      fs.writeFileSync(STATE_FILE, JSON.stringify(this.conversationHistory, null, 2));
    } catch (error) {
      console.error('Warning: Could not save conversation history:', error.message);
    }
  }

  async sendMessage(message) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // Make API call to OpenAI
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: this.conversationHistory,
        max_tokens: 1000,
        temperature: 0.7
      });

      const assistantMessage = completion.choices[0].message.content;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Save conversation state
      this.saveConversationHistory();

      return assistantMessage;
    } catch (error) {
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please set the OPENAI_API_KEY environment variable.');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
    }
  }

  newConversation() {
    this.conversationHistory = [];
    this.saveConversationHistory();
    console.log('Started a new conversation.');
  }

  getConversationLength() {
    return this.conversationHistory.length;
  }
}

// Main CLI function
async function main() {
  const program = new Command();
  
  program
    .name('chat')
    .description('CLI tool for chatting with ChatGPT')
    .version('1.0.0');

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    console.error('Please set it using: export OPENAI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const chatCLI = new ChatCLI();

  // Handle the 'new' command
  if (process.argv[2] === 'new') {
    chatCLI.newConversation();
    return;
  }

  // Handle regular chat messages
  const message = process.argv.slice(2).join(' ');
  
  if (!message) {
    console.error('Error: Please provide a message to send.');
    console.error('Usage: chat "your message here"');
    console.error('       chat new');
    process.exit(1);
  }

  try {
    console.log('Thinking...');
    const response = await chatCLI.sendMessage(message);
    console.log('\n' + response);
    
    const conversationLength = chatCLI.getConversationLength();
    if (conversationLength > 1) {
      console.log(`\n(Conversation has ${conversationLength / 2} exchanges)`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error.message);
    process.exit(1);
  });
}

module.exports = { ChatCLI };