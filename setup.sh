#!/bin/bash

echo "🚀 Setting up Career & Job Advisor..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install Ollama from https://ollama.ai/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Created .env.local - please review and update the configuration"
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Setting up database..."
npx prisma db push

# Check if Ollama is running
echo "🤖 Checking Ollama status..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is running"
else
    echo "⚠️ Ollama is not running. Starting Ollama..."
    ollama serve &
    sleep 5
fi

# Check if llama3.1 model is available
echo "🤖 Checking for Llama 3.1 model..."
if ollama list | grep -q "llama3.1"; then
    echo "✅ Llama 3.1 model is available"
else
    echo "📥 Pulling Llama 3.1 model (this may take a while)..."
    ollama pull llama3.1:latest
fi

# Seed the database
echo "🌱 Seeding database with sample data..."
npx prisma db seed

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Demo credentials:"
echo "  Email: demo@example.com"
echo "  Password: demo123"
echo ""
echo "Make sure Ollama is running for AI features:"
echo "  ollama serve"

