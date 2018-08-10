import {Actor,Action,Context} from "../genesis";
import {Genesis} from "./ec2_types";

const region = 'eu-west-1';
const tags = {
  created_by: 'john.mccabe@puppet.com',
  department: 'engineering',
  project   : 'incubator',
  lifetime  : '1h'
};

const attach = new Actor({
  vpc: new Action({
    callback: async (genesis: Context) => {
      let result = await genesis.apply(new Genesis.Aws.Vpc({
        title               : 'nyx-attachinternetgateway-test',
        ensure              : 'present',
        region              : region,
        cidr_block          : "192.168.0.0/16",
        tags                : tags,
        enable_dns_hostnames: true,
        enable_dns_support  : true,
      }));
      genesis.notice(`Created VPC: ${result.vpc_id}`);
      return {vpc_id: result.vpc_id};
    },
    produces: {vpc_id: 'string'}
  }),

  subnet: new Action({
    callback: async (genesis: Context, input: { vpc_id: string }) => {
      let result = await genesis.apply(new Genesis.Aws.Subnet({
        title                  : 'nyx-attachinternetgateway-test',
        ensure                 : 'present',
        region                 : region,
        vpc_id                 : input.vpc_id,
        cidr_block             : "192.168.1.0/24",
        tags                   : tags,
        map_public_ip_on_launch: true
      }));
      genesis.notice(`Created Subnet: ${result.subnet_id}`);
      return {subnet_id: result.subnet_id};
    },
    consumes: {vpc_id: 'string'},
    produces: {subnet_id: 'string'}
  }),

  gw: new Action({
    callback: async (genesis: Context) => {
      let result = await genesis.apply(new Genesis.Aws.InternetGateway({
        title : 'nyx-attachinternetgateway-test',
        ensure: 'present',
        region: region,
        tags  : tags,
      }));
      genesis.notice(`Created Internet Gateway: ${result.internet_gateway_id}`);
      return {internet_gateway_id: result.internet_gateway_id};
    },
    produces: {internet_gateway_id: 'string'}
  })
});

attach.start();
