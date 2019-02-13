#!/usr/bin/env bash

mkdir -p dist/datapb
mkdir -p dist/servicepb

cp -a generated/datapb/*.js dist/datapb/
cp -a generated/servicepb/*.js dist/servicepb/
