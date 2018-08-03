# generate js codes via grpc-tools

PUPPET_PATH=${GOPATH}/src/github.com/puppetlabs
HASHICORP_PATH=${GOPATH}/src/github.com/hashicorp
PROTO_PATH=fsmpb/fsm.proto

grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:src \
--grpc_out=src \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I $PUPPET_PATH/data-protobuf:$PUPPET_PATH/go-fsm \
datapb/data.proto fsmpb/fsm.proto

grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:src/plugin \
--grpc_out=src/plugin \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I $HASHICORP_PATH/go-plugin \
grpc_broker.proto

# generate d.ts codes
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=src \
-I $PUPPET_PATH/data-protobuf:$PUPPET_PATH/go-fsm \
datapb/data.proto fsmpb/fsm.proto

# generate d.ts codes
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=src/plugin \
-I $HASHICORP_PATH/go-plugin \
grpc_broker.proto
