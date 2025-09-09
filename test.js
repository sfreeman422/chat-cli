#!/bin/bash

# Test suite for chat-cli Bash implementation

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test state file for testing
TEST_STATE_FILE="/tmp/test-chat-state-$$.json"

# Function to run a test
run_test() {
    local test_name="$1"
    local test_function="$2"
    
    echo -n "Testing $test_name... "
    
    if $test_function 2>/dev/null; then
        echo -e "${GREEN}PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test: Check dependencies are available
test_dependencies() {
    command -v curl >/dev/null 2>&1 && command -v jq >/dev/null 2>&1
}

# Test: Chat script exists and is executable
test_script_executable() {
    [ -f "./chat" ] && [ -x "./chat" ]
}

# Test: Script shows usage when no arguments provided
test_usage_output() {
    local output
    output=$(unset OPENAI_API_KEY; ./chat 2>&1 || true)
    echo "$output" | grep -q "OPENAI_API_KEY environment variable is not set"
}

# Test: Script handles 'new' command without API key (should fail gracefully)
test_new_command_no_api_key() {
    local output
    # Unset API key for this test
    output=$(unset OPENAI_API_KEY; ./chat new 2>&1 || true)
    echo "$output" | grep -q "OPENAI_API_KEY environment variable is not set"
}

# Test: JSON state file operations
test_json_operations() {
    # Test creating empty conversation history
    echo "[]" > "$TEST_STATE_FILE"
    
    # Test adding a message to history
    local history
    history=$(cat "$TEST_STATE_FILE")
    local new_history
    new_history=$(echo "$history" | jq '. += [{"role": "user", "content": "test message"}]')
    
    # Check if message was added correctly
    local message_count
    message_count=$(echo "$new_history" | jq 'length')
    [ "$message_count" -eq 1 ]
}

# Test: State file creation and cleanup
test_state_file_operations() {
    # Create test state file
    echo "[]" > "$TEST_STATE_FILE"
    [ -f "$TEST_STATE_FILE" ]
    
    # Clean up
    rm -f "$TEST_STATE_FILE"
    [ ! -f "$TEST_STATE_FILE" ]
}

# Test: Conversation length calculation
test_conversation_length() {
    # Create test conversation with 2 messages
    local history='[{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi there!"}]'
    local length
    length=$(echo "$history" | jq 'length')
    [ "$length" -eq 2 ]
}

# Test: Message escaping for JSON
test_message_escaping() {
    local message='Hello "world" with quotes and \backslashes'
    local escaped
    escaped=$(echo "$message" | jq -R .)
    # Should be properly escaped JSON string
    echo "$escaped" | jq -r . >/dev/null 2>&1
}

# Clean up function
cleanup() {
    rm -f "$TEST_STATE_FILE"
}

# Set up cleanup trap
trap cleanup EXIT

# Main test execution
main() {
    echo -e "${BLUE}🧪 Running chat-cli Bash tests...${NC}"
    echo
    
    # Run tests
    run_test "dependencies available" test_dependencies
    run_test "script exists and executable" test_script_executable
    run_test "usage output" test_usage_output
    run_test "new command without API key" test_new_command_no_api_key
    run_test "JSON operations" test_json_operations
    run_test "state file operations" test_state_file_operations
    run_test "conversation length calculation" test_conversation_length
    run_test "message escaping" test_message_escaping
    
    echo
    echo -e "${BLUE}Test Results:${NC}"
    echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        return 0
    else
        echo -e "${RED}❌ Some tests failed!${NC}"
        return 1
    fi
}

# Run main function
main "$@"