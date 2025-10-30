run:
	docker compose up -d

stop:
	docker compose down

logs:
	docker compose logs -f

npm-ci:
	docker run --rm -v "$(PWD)":/app -w /app node:20-alpine npm ci

deploy-commands:
	docker run --rm -v "$(PWD)":/app -w /app node:20-alpine node --env-file=.env deploy-commands.js
