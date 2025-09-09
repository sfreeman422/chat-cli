#!/bin/bash

# Simple manual test for chat-cli Bash implementation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Running manual tests for chat-cli...${NC}"
echo

# Test 1: Check if script exists and is executable
echo "Test 1: Check script exists and is executable"
if [ -f "./chat" ] && [ -x "./chat" ]; then
    echo -e "${GREEN}✅ Chat script exists and is executable${NC}"
else
    echo -e "${RED}❌ Chat script not found or not executable${NC}"
    exit 1
fi

# Test 2: Check dependencies
echo
echo "Test 2: Check dependencies"
missing_deps=()

if ! command -v curl &> /dev/null; then
    missing_deps+=("curl")
fi

if ! command -v jq &> /dev/null; then
    missing_deps+=("jq")
fi

if [ ${#missing_deps[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All dependencies (curl, jq) are available${NC}"
else
    echo -e "${RED}❌ Missing dependencies: ${missing_deps[*]}${NC}"
    echo "Please install them and run the test again."
    exit 1
fi

# Test 3: Test usage output (without API key)
echo
echo "Test 3: Test usage output"
output=$(unset OPENAI_API_KEY; ./chat 2>&1 || true)
if echo "$output" | grep -q "OPENAI_API_KEY environment variable is not set"; then
    echo -e "${GREEN}✅ Proper error message for missing API key${NC}"
else
    echo -e "${RED}❌ Unexpected output for missing API key${NC}"
    echo "Output: $output"
fi

# Test 4: Test 'new' command (without API key)
echo
echo "Test 4: Test 'new' command handling"
output=$(unset OPENAI_API_KEY; ./chat new 2>&1 || true)
if echo "$output" | grep -q "OPENAI_API_KEY environment variable is not set"; then
    echo -e "${GREEN}✅ 'new' command properly checks for API key${NC}"
else
    echo -e "${RED}❌ 'new' command doesn't properly check for API key${NC}"
    echo "Output: $output"
fi

# Test 5: Test JSON operations
echo
echo "Test 5: Test JSON operations"
test_state_file="/tmp/test-chat-state-$$.json"

# Create empty conversation
echo "[]" > "$test_state_file"

# Add a message using jq
new_content=$(cat "$test_state_file" | jq '. += [{"role": "user", "content": "test message"}]')
echo "$new_content" > "$test_state_file"

# Check if message was added
message_count=$(cat "$test_state_file" | jq 'length')
if [ "$message_count" -eq 1 ]; then
    echo -e "${GREEN}✅ JSON operations work correctly${NC}"
else
    echo -e "${RED}❌ JSON operations failed${NC}"
fi

# Clean up test file
rm -f "$test_state_file"

echo
echo -e "${GREEN}🎉 Manual tests completed!${NC}"
echo
echo -e "${YELLOW}📝 To test with actual OpenAI API:${NC}"
echo "   1. Set OPENAI_API_KEY environment variable"
echo "   2. Run: ./chat \"Hello, how are you?\""
echo "   3. Run: ./chat new"
echo
echo -e "${YELLOW}💡 For full test suite, run: ./test.js${NC}"