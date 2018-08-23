#!/usr/bin/env bash

npm run build-examples
cp -r ./build/. ./docs/
