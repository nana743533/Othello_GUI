
.PHONY: up down build logs shell-backend shell-frontend

up:
	docker compose up

up-d:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

shell-backend:
	docker compose exec backend bash

shell-frontend:
	docker compose exec frontend sh

test-backend:
	docker compose exec backend bin/rails test test/controllers/api/v1/games_controller_test.rb
