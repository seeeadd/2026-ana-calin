#!/bin/zsh
# The real thing: full size, 30 fps, layers composited, both shapes, plus the small files for the page. tools/film/kit/final.sh <video> [--from s --to s] [--shape d]
export NODE_PATH="$HOME/AnaVideo/work/node_modules"
exec node "${0:A:h}/kit.js" "$1" --final --web "${@:2}"
