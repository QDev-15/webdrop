#!/bin/bash
cd "$(dirname "$0")"
node scaffolder.mjs "$1" "$2"
