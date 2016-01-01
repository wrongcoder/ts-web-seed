#!/bin/bash

if [ -z "$1" ]; then
	echo "Usage: $0 project-name"
	exit 1
fi

if [ -e "$1" ]; then
	echo "'$1' already exists."
	exit 1
fi

SCRIPT=$(python -c 'import os,sys;print os.path.realpath(sys.argv[1])' "$0")
SCRIPTDIR=$(dirname "$SCRIPT")

PROJECT=$(python -c 'import os,sys;print os.path.realpath(sys.argv[1])' "$1")


########## Initialize project ##########

set -e

cd "$SCRIPTDIR"
HEADCOMMIT=$(git rev-parse --verify HEAD^{commit})
HEADTREE=$(git rev-parse --verify HEAD^{tree})
DEFAULT_AUTHOR_NAME=$(git config user.name || true)
DEFAULT_AUTHOR_EMAIL=$(git config user.email || true)

git init "$PROJECT"
cd "$PROJECT"

if [ -n "$DEFAULT_AUTHOR_NAME" ]; then
	git config user.name "$DEFAULT_AUTHOR_NAME"
fi
if [ -n "$DEFAULT_AUTHOR_EMAIL" ]; then
	git config user.email "$DEFAULT_AUTHOR_EMAIL"
fi
if [ -n "$GIT_AUTHOR_NAME" ]; then
	git config user.name "$GIT_AUTHOR_NAME"
fi
if [ -n "$GIT_AUTHOR_EMAIL" ]; then
	git config user.email "$GIT_AUTHOR_EMAIL"
fi

git fetch --quiet "$SCRIPTDIR" HEAD

EMPTYTREE=$(git mktree < /dev/null)
NEWTREE=$(git ls-tree "$HEADTREE" | grep -vE '\b(new|update).sh\b' | git mktree)
COMMIT=$(git commit-tree "$EMPTYTREE" -m "Initialize repository")
COMMIT=$(git commit-tree "$NEWTREE" -p "$COMMIT" -p "$HEADCOMMIT" -m 'Import ts-web-seed')

git branch master "$COMMIT"
git reset --quiet --hard master
echo "New project created."
