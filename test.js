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
    echo "$output" | grep -q "Please provide a message to send"
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

# Test: New conversation with title
test_new_conversation_with_title() {
    export OPENAI_API_KEY="test-key"
    local output
    output=$(./chat new "Test Title" 2>&1)
    echo "$output" | grep -q "Started new conversation: 'Test Title'"
}

# Test: List conversations functionality
test_list_conversations() {
    export OPENAI_API_KEY="test-key"
    # Create a test conversation first
    ./chat new "Test List Conversation" >/dev/null 2>&1
    
    local output
    output=$(./chat list 2>&1)
    echo "$output" | grep -q "Test List Conversation"
}

# Test: Load conversation by title
test_load_conversation() {
    export OPENAI_API_KEY="test-key"
    # Create a test conversation first
    ./chat new "Load Test Conversation" >/dev/null 2>&1
    
    local output
    output=$(./chat load "Load Test Conversation" 2>&1)
    echo "$output" | grep -q "Loaded conversation: 'Load Test Conversation'"
}

# Test: Save conversation with new title
test_save_conversation() {
    export OPENAI_API_KEY="test-key"
    # Create a test conversation first
    ./chat new "Original Title" >/dev/null 2>&1
    
    local output
    output=$(./chat save "New Title" 2>&1)
    echo "$output" | grep -q "Saved conversation as: 'New Title'"
}

# Test: Conversation directory structure creation
test_directory_structure() {
    export OPENAI_API_KEY="test-key"
    # Clean up any existing test structure
    rm -rf ~/.chat-cli-test 2>/dev/null
    
    # Temporarily override the directory for testing
    local original_chat_dir="$HOME/.chat-cli"
    export HOME="/tmp/test-home-$$"
    mkdir -p "$HOME"
    
    # Run a command that should create the directory structure
    ./chat new "Structure Test" >/dev/null 2>&1
    
    # Check if directories were created
    [ -d "$HOME/.chat-cli" ] && [ -d "$HOME/.chat-cli/conversations" ] && [ -f "$HOME/.chat-cli/metadata.json" ]
    local result=$?
    
    # Clean up
    rm -rf "$HOME"
    export HOME="${HOME%/test-home-$$}"
    
    return $result
}

# Test: Migration from legacy state file
test_legacy_migration() {
    export OPENAI_API_KEY="test-key"
    local test_home="/tmp/test-migration-$$"
    mkdir -p "$test_home"
    
    # Create a legacy state file
    echo '[{"role": "user", "content": "test"}, {"role": "assistant", "content": "response"}]' > "$test_home/.chat-cli-state.json"
    
    # Temporarily override HOME
    local original_home="$HOME"
    export HOME="$test_home"
    
    # Run a command that should trigger migration
    ./chat new "Migration Test" >/dev/null 2>&1
    
    # Check if migration occurred (legacy file removed, new structure created)
    [ ! -f "$test_home/.chat-cli-state.json" ] && [ -d "$test_home/.chat-cli" ]
    local result=$?
    
    # Clean up
    export HOME="$original_home"
    rm -rf "$test_home"
    
    return $result
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
    
    # Run basic tests
    run_test "dependencies available" test_dependencies
    run_test "script exists and executable" test_script_executable
    run_test "usage output" test_usage_output
    run_test "new command without API key" test_new_command_no_api_key
    run_test "JSON operations" test_json_operations
    run_test "state file operations" test_state_file_operations
    run_test "conversation length calculation" test_conversation_length
    run_test "message escaping" test_message_escaping
    
    # Run new conversation management tests
    echo
    echo -e "${BLUE}🔗 Testing conversation management features...${NC}"
    run_test "new conversation with title" test_new_conversation_with_title
    run_test "list conversations" test_list_conversations
    run_test "load conversation" test_load_conversation
    run_test "save conversation" test_save_conversation
    run_test "directory structure creation" test_directory_structure
    run_test "legacy migration" test_legacy_migration
    
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