.PHONY: dev build test coverage codecov

dev:
	export DEBUG=grammy:*
	npm run start:dev
build:
	rm -rf dist
	npm run build
test:
	npm run test
coverage:
	npm run coverage
codecov:
	npm run codecov
