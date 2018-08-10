"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genesis = require("../genesis");
// Types generated based on typeset from provider
var Genesis;
(function (Genesis) {
    let Aws;
    (function (Aws) {
        class BasicResource extends genesis.Resource {
            constructor({ title, ensure, region, tags = {} }) {
                super({ title: title });
                this.ensure = ensure;
                this.region = region;
                this.tags = tags;
            }
        }
        class Vpc extends BasicResource {
            constructor({ title, ensure, region, tags, cidr_block, enable_dns_hostnames, enable_dns_support, vpc_id = 'FAKED_VPC_ID' }) {
                super({ title: title, ensure: ensure, region: region, tags: tags });
                this.cidr_block = cidr_block;
                this.enable_dns_hostnames = enable_dns_hostnames;
                this.enable_dns_support = enable_dns_support;
                this.vpc_id = vpc_id;
            }
        }
        Aws.Vpc = Vpc;
        class Subnet extends BasicResource {
            constructor({ title, ensure, region, tags, cidr_block, map_public_ip_on_launch, vpc_id, subnet_id = 'FAKED_SUBNET_ID' }) {
                super({ title: title, ensure: ensure, region: region, tags: tags });
                this.cidr_block = cidr_block;
                this.map_public_ip_on_launch = map_public_ip_on_launch;
                this.vpc_id = vpc_id;
                this.subnet_id = subnet_id;
            }
        }
        Aws.Subnet = Subnet;
        class InternetGateway extends BasicResource {
            constructor({ title, ensure, region, tags, internet_gateway_id = 'FAKED_GATEWAY_ID' }) {
                super({ title: title, ensure: ensure, region: region, tags: tags });
                this.internet_gateway_id = internet_gateway_id;
            }
        }
        Aws.InternetGateway = InternetGateway;
    })(Aws = Genesis.Aws || (Genesis.Aws = {}));
})(Genesis = exports.Genesis || (exports.Genesis = {}));
