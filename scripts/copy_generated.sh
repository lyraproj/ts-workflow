#!/usr/bin/env bash

mkdir -p dist/datapb
mkdir -p dist/servicepb

cp -r generated/datapb/* dist/datapb/
cp -r generated/servicepb/* dist/servicepb/
