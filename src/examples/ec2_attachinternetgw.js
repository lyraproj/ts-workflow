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
const genesis_1 = require("../genesis");
const ec2_types_1 = require("./ec2_types");
const region = 'eu-west-1';
const tags = {
    created_by: 'john.mccabe@puppet.com',
    department: 'engineering',
    project: 'incubator',
    lifetime: '1h'
};
const attach = new genesis_1.Actor({
    vpc: new genesis_1.Action({
        callback: (genesis) => __awaiter(this, void 0, void 0, function* () {
            let result = yield genesis.apply(new ec2_types_1.Genesis.Aws.Vpc({
                title: 'nyx-attachinternetgateway-test',
                ensure: 'present',
                region: region,
                cidr_block: "192.168.0.0/16",
                tags: tags,
                enable_dns_hostnames: true,
                enable_dns_support: true,
            }));
            genesis.notice(`Created VPC: ${result.vpc_id}`);
            return { vpc_id: result.vpc_id };
        }),
        output: { vpc_id: 'string' }
    }),
    subnet: new genesis_1.Action({
        callback: (genesis, input) => __awaiter(this, void 0, void 0, function* () {
            let result = yield genesis.apply(new ec2_types_1.Genesis.Aws.Subnet({
                title: 'nyx-attachinternetgateway-test',
                ensure: 'present',
                region: region,
                vpc_id: input.vpc_id,
                cidr_block: "192.168.1.0/24",
                tags: tags,
                map_public_ip_on_launch: true
            }));
            genesis.notice(`Created Subnet: ${result.subnet_id}`);
            return { subnet_id: result.subnet_id };
        }),
        input: { vpc_id: 'string' },
        output: { subnet_id: 'string' }
    }),
    gw: new genesis_1.Action({
        callback: (genesis) => __awaiter(this, void 0, void 0, function* () {
            let result = yield genesis.apply(new ec2_types_1.Genesis.Aws.InternetGateway({
                title: 'nyx-attachinternetgateway-test',
                ensure: 'present',
                region: region,
                tags: tags,
            }));
            genesis.notice(`Created Internet Gateway: ${result.internet_gateway_id}`);
            return { internet_gateway_id: result.internet_gateway_id };
        }),
        output: { internet_gateway_id: 'string' }
    })
});
attach.start();
