"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const genesis_1 = require("./genesis");
const region = 'eu-west-1';
const tags = {
    created_by: 'john.mccabe@puppet.com',
    department: 'engineering',
    project: 'incubator',
    lifetime: '1h'
};
const attach = new genesis_1.Actor();
attach.Action('vpc', (genesis) => __awaiter(this, void 0, void 0, function* () {
    let result = yield genesis.apply({
        title: 'nyx-attachinternetgateway-test',
        ensure: 'present',
        region: region,
        cidr_block: "192.168.0.0/16",
        tags: tags,
        enable_dns_hostnames: true,
        enable_dns_support: true,
    });
    result.vpc_id = (yield genesis.lookup('test')); // Faking it
    genesis.notice(`Created VPC: ${result.vpc_id}`);
    return { vpc_id: result.vpc_id };
}), {}, { vpc_id: 'String' });
attach.Action('subnet', (genesis, input) => __awaiter(this, void 0, void 0, function* () {
    let result = yield genesis.apply({
        title: 'nyx-attachinternetgateway-test',
        ensure: 'present',
        region: region,
        vpc_id: input.vpc_id,
        cidr_block: "192.168.1.0/24",
        tags: tags,
        map_public_ip_on_launch: true
    });
    result.subnet_id = 'FAKE_SUBNET_ID'; // Faking it
    return { subnet_id: result.subnet_id };
}), { 'vpc.id': 'String' }, { subnet_id: 'String' });
attach.Action('gw', (genesis) => __awaiter(this, void 0, void 0, function* () {
    let result = yield genesis.apply({
        title: 'nyx-attachinternetgateway-test',
        ensure: 'present',
        region: region,
        tags: tags,
    });
    result.internet_gateway_id = 'FAKE_GATEWAY_ID'; // Faking it
    return { internet_gateway_id: result.internet_gateway_id };
}), {}, { internet_gateway_id: 'String' });
attach.start();
