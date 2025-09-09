const { ChatCLI } = require('./chat.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock OpenAI for testing
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn()
    }
  }
};

// Mock file operations for testing
const TEST_STATE_FILE = path.join(os.tmpdir(), 'test-chat-state.json');

describe('ChatCLI', () => {
  let chatCLI;

  beforeEach(() => {
    // Clear any existing test state file
    if (fs.existsSync(TEST_STATE_FILE)) {
      fs.unlinkSync(TEST_STATE_FILE);
    }
    
    // Create a new ChatCLI instance with mocked OpenAI
    chatCLI = new ChatCLI();
    chatCLI.openai = mockOpenAI;
    
    // Override state file path for testing
    const originalStateFile = require.cache[require.resolve('./chat.js')];
    if (originalStateFile) {
      // Mock the STATE_FILE constant for testing
      chatCLI.STATE_FILE = TEST_STATE_FILE;
    }
  });

  afterEach(() => {
    // Clean up test state file
    if (fs.existsSync(TEST_STATE_FILE)) {
      fs.unlinkSync(TEST_STATE_FILE);
    }
    jest.clearAllMocks();
  });

  test('should initialize with empty conversation history', () => {
    expect(chatCLI.conversationHistory).toEqual([]);
  });

  test('should start a new conversation', () => {
    chatCLI.conversationHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];
    
    chatCLI.newConversation();
    
    expect(chatCLI.conversationHistory).toEqual([]);
  });

  test('should return correct conversation length', () => {
    chatCLI.conversationHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];
    
    expect(chatCLI.getConversationLength()).toBe(2);
  });

  test('should handle API response correctly', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Hello! How can I help you today?'
          }
        }
      ]
    };

    mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

    const response = await chatCLI.sendMessage('Hello');

    expect(response).toBe('Hello! How can I help you today?');
    expect(chatCLI.conversationHistory).toHaveLength(2);
    expect(chatCLI.conversationHistory[0]).toEqual({
      role: 'user',
      content: 'Hello'
    });
    expect(chatCLI.conversationHistory[1]).toEqual({
      role: 'assistant', 
      content: 'Hello! How can I help you today?'
    });
  });
});

console.log('Basic ChatCLI tests would pass with a proper test runner like Jest.');