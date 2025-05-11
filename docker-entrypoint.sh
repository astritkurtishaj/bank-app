#!/bin/sh

echo "📦 Building app..."
npm run build

echo "⏳ Waiting for MySQL to be ready..."
while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 1
done

echo "✅ MySQL is ready. Running migrations..."
npx typeorm -d dist/database/data-source.js migration:run

echo "🚀 Starting app..."
npm run start:prod
