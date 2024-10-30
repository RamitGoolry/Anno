.PHONY: prebuild clean start run-ios pods install-dev-client

# Basic commands
install-dev-client:
	npx expo install expo-dev-client

clean:
	rm -rf ios
	rm -rf node_modules
	rm -rf package-lock.json

install:
	npm install

# iOS specific
prebuild-ios:
	npx expo prebuild --platform ios --clean

pods:
	cd ios && pod install

run-ios:
	npx expo run:ios

# Development
start:
	npx expo start

# Combined commands
setup: clean install install-dev-client prebuild-ios pods

# Default start command
dev: start
