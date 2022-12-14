# export NODE_OPTIONS=--openssl-legacy-provider
.PHONY: all

include .env
export

all: setup clean compile test

setup:
	yarn
	yarn global add hardhat-shorthand

clean:
	rm -rf artifacts cache

compile:
	yarn prepare
# cp artifacts/contracts/*.sol/*.json ../website-back-strapi/abis/

run_node:
	hh node

deploy:
	hh run scripts/deployContracts.ts --network mumbai

test:
	yarn test
