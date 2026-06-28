.PHONY: dev backend frontend install

install:
	cd backend && cargo build
	cd frontend && npm install

backend:
	cd backend && cargo run

frontend:
	cd frontend && npm run dev

dev: backend frontend
