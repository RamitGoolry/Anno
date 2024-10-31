.PHONY: start build

default: start

# Basic commands
clean:
	rm -rf ios
	rm -rf node_modules
	rm -rf package-lock.json

install:
	npm install

# Development
build:
	eas build --profile development --platform ios

start:
	npx expo start

# Combined commands
setup: clean install build
