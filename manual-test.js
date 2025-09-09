#!/usr/bin/env node

// Simple manual test for chat-cli functionality
const { ChatCLI } = require('./chat.js');

console.log('🧪 Running manual tests for chat-cli...\n');

// Test 1: Initialize ChatCLI
console.log('Test 1: Initialize ChatCLI');
try {
  const chatCLI = new ChatCLI();
  console.log('✅ ChatCLI initialized successfully');
  console.log(`   Initial conversation length: ${chatCLI.getConversationLength()}`);
} catch (error) {
  console.log('❌ Failed to initialize ChatCLI:', error.message);
}

// Test 2: New conversation
console.log('\nTest 2: New conversation');
try {
  const chatCLI = new ChatCLI();
  chatCLI.newConversation();
  console.log('✅ New conversation started successfully');
  console.log(`   Conversation length after new: ${chatCLI.getConversationLength()}`);
} catch (error) {
  console.log('❌ Failed to start new conversation:', error.message);
}

// Test 3: Conversation history management
console.log('\nTest 3: Conversation history management');
try {
  const chatCLI = new ChatCLI();
  
  // Simulate adding messages to history
  chatCLI.conversationHistory.push({ role: 'user', content: 'Hello' });
  chatCLI.conversationHistory.push({ role: 'assistant', content: 'Hi there!' });
  
  console.log('✅ Conversation history management works');
  console.log(`   Conversation length: ${chatCLI.getConversationLength()}`);
  
  chatCLI.newConversation();
  console.log(`   Length after new conversation: ${chatCLI.getConversationLength()}`);
} catch (error) {
  console.log('❌ Failed conversation history test:', error.message);
}

console.log('\n🎉 Manual tests completed!');
console.log('\n📝 To test with actual OpenAI API:');
console.log('   1. Set OPENAI_API_KEY environment variable');
console.log('   2. Run: chat "Hello, how are you?"');
console.log('   3. Run: chat new');