// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var fsmpb_fsm_pb = require('../fsmpb/fsm_pb.js');
var datapb_data_pb = require('../datapb/data_pb.js');

function serialize_puppet_fsm_Actor(arg) {
  if (!(arg instanceof fsmpb_fsm_pb.Actor)) {
    throw new Error('Expected argument of type puppet.fsm.Actor');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_fsm_Actor(buffer_arg) {
  return fsmpb_fsm_pb.Actor.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_fsm_ActorRequest(arg) {
  if (!(arg instanceof fsmpb_fsm_pb.ActorRequest)) {
    throw new Error('Expected argument of type puppet.fsm.ActorRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_fsm_ActorRequest(buffer_arg) {
  return fsmpb_fsm_pb.ActorRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_puppet_fsm_Message(arg) {
  if (!(arg instanceof fsmpb_fsm_pb.Message)) {
    throw new Error('Expected argument of type puppet.fsm.Message');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_puppet_fsm_Message(buffer_arg) {
  return fsmpb_fsm_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}


var ActorsService = exports.ActorsService = {
  getActor: {
    path: '/puppet.fsm.Actors/GetActor',
    requestStream: false,
    responseStream: false,
    requestType: fsmpb_fsm_pb.ActorRequest,
    responseType: fsmpb_fsm_pb.Actor,
    requestSerialize: serialize_puppet_fsm_ActorRequest,
    requestDeserialize: deserialize_puppet_fsm_ActorRequest,
    responseSerialize: serialize_puppet_fsm_Actor,
    responseDeserialize: deserialize_puppet_fsm_Actor,
  },
  invokeAction: {
    path: '/puppet.fsm.Actors/InvokeAction',
    requestStream: true,
    responseStream: true,
    requestType: fsmpb_fsm_pb.Message,
    responseType: fsmpb_fsm_pb.Message,
    requestSerialize: serialize_puppet_fsm_Message,
    requestDeserialize: deserialize_puppet_fsm_Message,
    responseSerialize: serialize_puppet_fsm_Message,
    responseDeserialize: deserialize_puppet_fsm_Message,
  },
};

exports.ActorsClient = grpc.makeGenericClientConstructor(ActorsService);
