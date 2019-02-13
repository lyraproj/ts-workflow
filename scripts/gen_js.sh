#!/usr/bin/env bash
# generate js codes via grpc-tools

mkdir generated

LYRA_PATH=${GOPATH}/src/github.com/lyraproj
HASHICORP_PATH=${GOPATH}/src/github.com/hashicorp
PROTO_FILES="datapb/data.proto servicepb/service.proto"

`npm bin`/grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:generated \
--grpc_out=generated \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ${LYRA_PATH}/data-protobuf:${LYRA_PATH}/servicesdk ${PROTO_FILES}

# generate d.ts codes
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=generated \
-I ${LYRA_PATH}/data-protobuf:${LYRA_PATH}/servicesdk ${PROTO_FILES}
