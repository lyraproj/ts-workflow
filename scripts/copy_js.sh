#!/usr/bin/env bash

mkdir -p dist/src/datapb
mkdir -p dist/src/fsmpb

cp -a generated/datapb/*.js dist/src/datapb/
cp -a generated/fsmpb/*.js dist/src/fsmpb/
