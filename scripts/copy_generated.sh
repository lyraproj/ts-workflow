#!/usr/bin/env bash

mkdir -p dist/datapb
mkdir -p dist/servicepb

cp -ur generated/datapb/* dist/datapb/
cp -ur generated/servicepb/* dist/servicepb/
