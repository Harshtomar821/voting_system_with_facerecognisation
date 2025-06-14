#!/bin/bash
# Installation script for face recognition dependencies

echo "Installing Python dependencies for face recognition..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Install pip if not available
if ! command -v pip3 &> /dev/null; then
    echo "Installing pip..."
    python3 -m ensurepip --upgrade
fi

# Install required packages
echo "Installing required Python packages..."
pip3 install -r requirements.txt

echo "Face recognition setup complete!"
echo "Note: On some systems, you may need to install additional system dependencies:"
echo "  - Ubuntu/Debian: sudo apt-get install python3-dev libpython3-dev"
echo "  - macOS: brew install cmake"
echo "  - Windows: Install Visual Studio Build Tools"