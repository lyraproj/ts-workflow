// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var servicepb_service_pb = require('../servicepb/service_pb.js');
var datapb_data_pb = require('../datapb/data_pb.js');

function serialize_puppet_datapb_Data(arg) {
  if (!(arg instanceof datapb_data_pb.Data)) {
    throw new Error('Expected argument of type puppet.datapb.Data');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_datapb_Data(buffer_arg) {
  return datapb_data_pb.Data.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_service_EmptyRequest(arg) {
  if (!(arg instanceof servicepb_service_pb.EmptyRequest)) {
    throw new Error('Expected argument of type puppet.service.EmptyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_service_EmptyRequest(buffer_arg) {
  return servicepb_service_pb.EmptyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_service_InvokeRequest(arg) {
  if (!(arg instanceof servicepb_service_pb.InvokeRequest)) {
    throw new Error('Expected argument of type puppet.service.InvokeRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_service_InvokeRequest(buffer_arg) {
  return servicepb_service_pb.InvokeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_service_MetadataResponse(arg) {
  if (!(arg instanceof servicepb_service_pb.MetadataResponse)) {
    throw new Error('Expected argument of type puppet.service.MetadataResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_service_MetadataResponse(buffer_arg) {
  return servicepb_service_pb.MetadataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_service_StateRequest(arg) {
  if (!(arg instanceof servicepb_service_pb.StateRequest)) {
    throw new Error('Expected argument of type puppet.service.StateRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_service_StateRequest(buffer_arg) {
  return servicepb_service_pb.StateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var DefinitionServiceService = exports.DefinitionServiceService = {
  identity: {
    path: '/puppet.service.DefinitionService/Identity',
    requestStream: false,
    responseStream: false,
    requestType: servicepb_service_pb.EmptyRequest,
    responseType: datapb_data_pb.Data,
    requestSerialize: serialize_puppet_service_EmptyRequest,
    requestDeserialize: deserialize_puppet_service_EmptyRequest,
    responseSerialize: serialize_puppet_datapb_Data,
    responseDeserialize: deserialize_puppet_datapb_Data,
  },
  invoke: {
    path: '/puppet.service.DefinitionService/Invoke',
    requestStream: false,
    responseStream: false,
    requestType: servicepb_service_pb.InvokeRequest,
    responseType: datapb_data_pb.Data,
    requestSerialize: serialize_puppet_service_InvokeRequest,
    requestDeserialize: deserialize_puppet_service_InvokeRequest,
    responseSerialize: serialize_puppet_datapb_Data,
    responseDeserialize: deserialize_puppet_datapb_Data,
  },
  metadata: {
    path: '/puppet.service.DefinitionService/Metadata',
    requestStream: false,
    responseStream: false,
    requestType: servicepb_service_pb.EmptyRequest,
    responseType: servicepb_service_pb.MetadataResponse,
    requestSerialize: serialize_puppet_service_EmptyRequest,
    requestDeserialize: deserialize_puppet_service_EmptyRequest,
    responseSerialize: serialize_puppet_service_MetadataResponse,
    responseDeserialize: deserialize_puppet_service_MetadataResponse,
  },
  state: {
    path: '/puppet.service.DefinitionService/State',
    requestStream: false,
    responseStream: false,
    requestType: servicepb_service_pb.StateRequest,
    responseType: datapb_data_pb.Data,
    requestSerialize: serialize_puppet_service_StateRequest,
    requestDeserialize: deserialize_puppet_service_StateRequest,
    responseSerialize: serialize_puppet_datapb_Data,
    responseDeserialize: deserialize_puppet_datapb_Data,
  },
};

exports.DefinitionServiceClient = grpc.makeGenericClientConstructor(DefinitionServiceService);
