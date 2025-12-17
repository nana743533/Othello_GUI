# Makefile for Othello AI

CXX = g++
CXXFLAGS = -Wall -Wextra -O3
TEST_FLAGS = -Wall -Wextra -O2

# Default target
all: othello

# Build the main AI binary
othello: othello.cpp ai1.cpp board.hpp cell_evaluate.hpp
	$(CXX) $(CXXFLAGS) -o othello othello.cpp

# Build and run tests
test: test_othello
	./test_othello

# Build test binary
test_othello: test_othello.cpp ai1.cpp board.hpp cell_evaluate.hpp
	$(CXX) $(TEST_FLAGS) -o test_othello test_othello.cpp

# Clean build artifacts
clean:
	rm -f othello test_othello

# Rebuild everything
rebuild: clean all

.PHONY: all test clean rebuild
