#!/bin/bash

# Crypto Cartel Test Runner
# Runs all integration tests for the platform

echo "🧪 Crypto Cartel Transparency Platform - Test Suite"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${YELLOW}Checking backend status...${NC}"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running on http://localhost:8000${NC}"
else
    echo -e "${RED}✗ Backend is not running!${NC}"
    echo -e "${YELLOW}Please start the backend first:${NC}"
    echo "  cd ../backend && bash start_server.sh"
    exit 1
fi

echo ""

# Check if frontend is running
echo -e "${YELLOW}Checking frontend status...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is running on http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is not running (optional for API tests)${NC}"
fi

echo ""
echo "=================================================="
echo ""

# Run tests based on argument
case "$1" in
    "api")
        echo -e "${YELLOW}Running API Integration Tests...${NC}"
        npm run test:api
        ;;
    "e2e")
        echo -e "${YELLOW}Running End-to-End Tests...${NC}"
        npm run test:e2e
        ;;
    "db")
        echo -e "${YELLOW}Running Database Tests...${NC}"
        npm run test:db
        ;;
    "coverage")
        echo -e "${YELLOW}Running All Tests with Coverage...${NC}"
        npm run test:coverage
        ;;
    *)
        echo -e "${YELLOW}Running All Tests...${NC}"
        npm test
        ;;
esac

TEST_EXIT_CODE=$?

echo ""
echo "=================================================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed successfully!${NC}"
else
    echo -e "${RED}✗ Some tests failed. Check output above.${NC}"
fi

exit $TEST_EXIT_CODE
