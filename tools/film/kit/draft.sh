#!/bin/zsh
# A draft to show early: half size, 15 fps, both shapes. tools/film/kit/draft.sh <video> [--from s --to s] [--shape d]
export NODE_PATH="$HOME/AnaVideo/work/node_modules"
exec node "${0:A:h}/kit.js" "$1" --draft "${@:2}"
