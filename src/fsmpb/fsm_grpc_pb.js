// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var fsmpb_fsm_pb = require('../fsmpb/fsm_pb.js');
var datapb_data_pb = require('../datapb/data_pb.js');

function serialize_puppet_datapb_DataHash(arg) {
  if (!(arg instanceof datapb_data_pb.DataHash)) {
    throw new Error('Expected argument of type puppet.datapb.DataHash');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_datapb_DataHash(buffer_arg) {
  return datapb_data_pb.DataHash.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_fsm_ActionInvocation(arg) {
  if (!(arg instanceof fsmpb_fsm_pb.ActionInvocation)) {
    throw new Error('Expected argument of type puppet.fsm.ActionInvocation');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_fsm_ActionInvocation(buffer_arg) {
  return fsmpb_fsm_pb.ActionInvocation.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_fsm_ActionsRequest(arg) {
  if (!(arg instanceof fsmpb_fsm_pb.ActionsRequest)) {
    throw new Error('Expected argument of type puppet.fsm.ActionsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_fsm_ActionsRequest(buffer_arg) {
  return fsmpb_fsm_pb.ActionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_fsm_ActionsResponse(arg) {
  if (!(arg instanceof fsmpb_fsm_pb.ActionsResponse)) {
    throw new Error('Expected argument of type puppet.fsm.ActionsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_fsm_ActionsResponse(buffer_arg) {
  return fsmpb_fsm_pb.ActionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ActorService = exports.ActorService = {
  getActions: {
    path: '/puppet.fsm.Actor/GetActions',
    requestStream: false,
    responseStream: false,
    requestType: fsmpb_fsm_pb.ActionsRequest,
    responseType: fsmpb_fsm_pb.ActionsResponse,
    requestSerialize: serialize_puppet_fsm_ActionsRequest,
    requestDeserialize: deserialize_puppet_fsm_ActionsRequest,
    responseSerialize: serialize_puppet_fsm_ActionsResponse,
    responseDeserialize: deserialize_puppet_fsm_ActionsResponse,
  },
  invokeAction: {
    path: '/puppet.fsm.Actor/InvokeAction',
    requestStream: false,
    responseStream: false,
    requestType: fsmpb_fsm_pb.ActionInvocation,
    responseType: datapb_data_pb.DataHash,
    requestSerialize: serialize_puppet_fsm_ActionInvocation,
    requestDeserialize: deserialize_puppet_fsm_ActionInvocation,
    responseSerialize: serialize_puppet_datapb_DataHash,
    responseDeserialize: deserialize_puppet_datapb_DataHash,
  },
};

exports.ActorClient = grpc.makeGenericClientConstructor(ActorService);
