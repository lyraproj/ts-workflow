import {Genesis} from "./ec2_types";
import {Context} from "../src/genesis/genesis";
import {ActorServer, StringMap} from "../src/genesis/genesis";

const server = new ActorServer({Genesis: Genesis},2000, 2100);

// Well known types will be pre-registered, but for brevity ...
server.registerType('StringMap', '{[s: string]: string}');

server.addActor('attach', {
  input: {
    region: {type: 'string', lookup: 'aws.region'},
    tags: {type: 'StringMap', lookup: 'aws.tags'}
  },
  output: {
    vpc_id: 'string',
    subnet_id: 'string',
    internet_gateway_id: 'string'
  },
  actions: {
    vpc: {
      input   : {region: 'string', tags: 'StringMap'},
      output  : {vpc_id: 'string', subnet_id: 'string'},
      producer: async (ctx: Context, input: { region: string, tags: 'StringMap' }) => {
        let vpc = await ctx.resource(new Genesis.Aws.Vpc({
          title               : 'nyx-attachinternetgateway-test',
          ensure              : 'present',
          region              : input.region,
          cidr_block          : "192.168.0.0/16",
          tags                : input.tags,
          enable_dns_hostnames: true,
          enable_dns_support  : true
        }));
        ctx.notice(`Created VPC: ${vpc.vpc_id}`);

        let subnet = await ctx.resource(new Genesis.Aws.Subnet({
          title                  : 'nyx-attachinternetgateway-test',
          ensure                 : 'present',
          region                 : input.region,
          vpc_id                 : vpc.vpc_id,
          cidr_block             : "192.168.1.0/24",
          tags                   : input.tags,
          map_public_ip_on_launch: true
        }));
        ctx.notice(`Created Subnet: ${subnet.subnet_id}`);
        return {vpc_id: vpc.vpc_id, subnet_id: subnet.subnet_id};
      }
    },

    gw: {
      input   : {region: 'string', tags: 'StringMap'},
      output  : {internet_gateway_id: 'string'},
      producer: async (ctx: Context, input: { region: string, tags: StringMap }) => {
        let result = await ctx.resource(new Genesis.Aws.InternetGateway({
          title : 'nyx-attachinternetgateway-test',
          ensure: 'present',
          region: input.region,
          tags  : input.tags
        }));
        ctx.notice(`Created Internet Gateway: ${result.internet_gateway_id}`);
        return {internet_gateway_id: result.internet_gateway_id};
      }
    }
  }
});

server.start();
