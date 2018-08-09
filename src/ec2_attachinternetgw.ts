import {Actor, Genesis, Resource} from "./genesis";

// Types generated based on typeset from provider
namespace Genesis {
  export namespace Aws {
    export interface BasicResource extends Resource {
      ensure: string;
      region: string;
      tags: {};
    }

    export interface Vpc extends BasicResource {
      cidr_block: string;
      enable_dns_hostnames: boolean;
      enable_dns_support: boolean;
      vpc_id?: string;
    }

    export interface Subnet extends BasicResource {
      cidr_block: string;
      vpc_id: string;
      map_public_ip_on_launch: boolean;
      subnet_id?: string;
    }

    export interface InternetGateway extends BasicResource {
      internet_gateway_id?: string
    }
  }
}

const region = 'eu-west-1';
const tags = {
  created_by: 'john.mccabe@puppet.com',
  department: 'engineering',
  project: 'incubator',
  lifetime: '1h'
};

const attach = new Actor();

attach.Action('vpc', async (genesis: Genesis) => {
  let result = await genesis.apply<Genesis.Aws.Vpc>({
    title: 'nyx-attachinternetgateway-test',
    ensure: 'present',
    region: region,
    cidr_block: "192.168.0.0/16",
    tags: tags,
    enable_dns_hostnames: true,
    enable_dns_support: true,
  });
  result.vpc_id = <string> await genesis.lookup('test'); // Faking it
  genesis.notice(`Created VPC: ${result.vpc_id}`);
  return {vpc_id: result.vpc_id};
}, {}, {vpc_id: 'String'});

attach.Action('subnet', async (genesis: Genesis, input: { vpc_id: string }) => {
  let result = await genesis.apply<Genesis.Aws.Subnet>({
    title:  'nyx-attachinternetgateway-test',
    ensure: 'present',
    region: region,
    vpc_id: input.vpc_id,
    cidr_block: "192.168.1.0/24",
    tags: tags,
    map_public_ip_on_launch: true
  });
  result.subnet_id = 'FAKE_SUBNET_ID'; // Faking it
  return {subnet_id: result.subnet_id};
}, {'vpc.id': 'String'}, {subnet_id: 'String'});

attach.Action('gw', async (genesis: Genesis) => {
  let result = await genesis.apply<Genesis.Aws.InternetGateway>({
    title: 'nyx-attachinternetgateway-test',
    ensure: 'present',
    region: region,
    tags: tags,
  });
  result.internet_gateway_id = 'FAKE_GATEWAY_ID'; // Faking it
  return {internet_gateway_id: result.internet_gateway_id};
}, {}, {internet_gateway_id: 'String'});

attach.start();
