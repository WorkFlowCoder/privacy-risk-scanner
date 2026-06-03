#!/bin/bash
# Reset database schema - run from project root

echo "Removing persistent PostgreSQL volume..."
docker volume rm privacy-risk-scanner_postgres_data

echo "Recreating database with new schema..."
docker-compose up -d postgres
docker-compose exec -T postgres bash -c 'sleep 5 && psql -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/schema.sql'
docker-compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/001-fix-column-sizes.sql

echo "✅ Database reset complete"
