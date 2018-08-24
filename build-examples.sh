#!/usr/bin/env bash

npm run build-examples
rm -r ./docs/*
cp -r ./build/. ./docs/
