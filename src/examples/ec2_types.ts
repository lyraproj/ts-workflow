import * as genesis from "../genesis";

// Types generated based on typeset from provider
export namespace Genesis {
  export namespace Aws {
    abstract class BasicResource extends genesis.Resource {
      readonly ensure: string;
      readonly region: string;
      readonly tags: {};

      protected constructor({title, ensure, region, tags = {}}: {
        title: string,
        ensure: string,
        region: string,
        tags?: {}
      }) {
        super({title: title});
        this.ensure = ensure;
        this.region = region;
        this.tags = tags;
      }
    }

    export class Vpc extends BasicResource {
      readonly cidr_block: string;
      readonly enable_dns_hostnames: boolean;
      readonly enable_dns_support: boolean;
      readonly vpc_id: string;

      constructor(
        {
          title,
          ensure,
          region,
          tags,
          cidr_block,
          enable_dns_hostnames,
          enable_dns_support,
          vpc_id = 'FAKED_VPC_ID'
        }: {
          title: string,
          ensure: string,
          region: string,
          tags: {},
          cidr_block: string,
          enable_dns_hostnames: boolean,
          enable_dns_support: boolean,
          vpc_id?: string
        }) {
        super({title: title, ensure: ensure, region: region, tags: tags});
        this.cidr_block = cidr_block;
        this.enable_dns_hostnames = enable_dns_hostnames;
        this.enable_dns_support = enable_dns_support;
        this.vpc_id = vpc_id;
      }
    }

    export class Subnet extends BasicResource {
      readonly cidr_block: string;
      readonly map_public_ip_on_launch: boolean;
      readonly vpc_id: string;
      readonly subnet_id: string;

      constructor(
        {
          title,
          ensure,
          region,
          tags,
          cidr_block,
          map_public_ip_on_launch,
          vpc_id,
          subnet_id = 'FAKED_SUBNET_ID'
        }: {
          title: string,
          ensure: string,
          region: string,
          tags: {},
          cidr_block: string,
          map_public_ip_on_launch: boolean,
          vpc_id: string
          subnet_id?: string,
        }) {
        super({title: title, ensure: ensure, region: region, tags: tags});
        this.cidr_block = cidr_block;
        this.map_public_ip_on_launch = map_public_ip_on_launch;
        this.vpc_id = vpc_id;
        this.subnet_id = subnet_id;
      }
    }

    export class InternetGateway extends BasicResource {
      readonly internet_gateway_id: string;

      constructor(
        {
          title,
          ensure,
          region,
          tags,
          internet_gateway_id = 'FAKED_GATEWAY_ID'
        }: {
          title: string,
          ensure: string,
          region: string,
          tags: {},
          internet_gateway_id?: string
        }) {
        super({title: title, ensure: ensure, region: region, tags: tags});
        this.internet_gateway_id = internet_gateway_id;
      }
    }
  }
}
