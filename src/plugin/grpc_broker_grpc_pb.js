// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var grpc_broker_pb = require('./grpc_broker_pb.js');

function serialize_plugin_ConnInfo(arg) {
  if (!(arg instanceof grpc_broker_pb.ConnInfo)) {
    throw new Error('Expected argument of type plugin.ConnInfo');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_plugin_ConnInfo(buffer_arg) {
  return grpc_broker_pb.ConnInfo.deserializeBinary(new Uint8Array(buffer_arg));
}


var GRPCBrokerService = exports.GRPCBrokerService = {
  startStream: {
    path: '/plugin.GRPCBroker/StartStream',
    requestStream: true,
    responseStream: true,
    requestType: grpc_broker_pb.ConnInfo,
    responseType: grpc_broker_pb.ConnInfo,
    requestSerialize: serialize_plugin_ConnInfo,
    requestDeserialize: deserialize_plugin_ConnInfo,
    responseSerialize: serialize_plugin_ConnInfo,
    responseDeserialize: deserialize_plugin_ConnInfo,
  },
};

exports.GRPCBrokerClient = grpc.makeGenericClientConstructor(GRPCBrokerService);
