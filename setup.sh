#!/bin/bash

# AI Notes App Setup Script
# This script helps set up the AI Notes Electron app

set -e

echo "================================"
echo "AI Notes App - Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if we're in the AIAPP directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the AIAPP directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Setup .env file
if [ ! -f ".env" ]; then
    echo "🔑 Setting up environment file..."
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your Gemini API key!"
    echo "   Get your free API key from: https://makersuite.google.com/app/apikey"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if API key is set
if grep -q "your_gemini_api_key_here" .env 2>/dev/null; then
    echo "⚠️  WARNING: API key not configured in .env file"
    echo "   Please edit .env and replace 'your_gemini_api_key_here' with your actual API key"
    echo ""
fi

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your Gemini API key (if not done already)"
echo "2. Run 'npm run dev' to start development mode"
echo "3. Or run 'npm run build:mac' or 'npm run build:linux' to build for production"
echo ""
echo "For more information, see README.md"
echo ""
