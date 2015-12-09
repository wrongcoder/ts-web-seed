#!/bin/bash

if [ -z "$1" ]; then
	echo "Usage: $0 project-name"
	exit 1
fi

if [ ! -d "$1" ]; then
	echo "'$1' is not a directory."
	exit 1
fi

if ! (cd "$1" && git rev-parse 2>/dev/null); then
	echo "'$1' is not a git repository."
	exit 1
fi

SCRIPT=$(python -c 'import os,sys;print os.path.realpath(sys.argv[1])' "$0")
SCRIPTDIR=$(dirname "$SCRIPT")

PROJECT=$(python -c 'import os,sys;print os.path.realpath(sys.argv[1])' "$1")


########## Update project ##########

set -e

cd "$SCRIPTDIR"
HEADCOMMIT=$(git rev-parse --verify HEAD^{commit})
HEADTREE=$(git rev-parse --verify HEAD^{tree})

cd "$PROJECT"

git fetch --quiet "$SCRIPTDIR" HEAD

NEWTREE=$(git ls-tree "$HEADTREE" | grep -vE '\b(new|update).sh\b' | git mktree)
NEWCOMMIT=$(git commit-tree "$NEWTREE" -p "$HEADCOMMIT" -m 'Remove scripts')

echo 'Merging ts-web-seed.'
git merge "$NEWCOMMIT" -m 'Update ts-web-seed' --no-commit
