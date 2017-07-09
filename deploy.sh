#!/usr/bin/env bash

if [ "$CI" = "true" ]
then
  git config --global user.email "bot@egoist.moe"
  git config --global user.name "egoist bot"
  repo=https://$GH_TOKEN@github.com/egoist/codepan.git
else
  repo=git@github.com:egoist/codepan.git
fi

./node_modules/.bin/gh-pages \
  --silent $CI \
  --repo $repo \
  --dist dist
