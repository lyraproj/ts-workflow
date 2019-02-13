import * as Aws from "./Aws";
import {action, resource, workflow} from "../src/servicesdk/ServiceBuilder";

function makeRouteTable(vpcId: string, tags: { [s: string]: string }): Aws.RouteTable {
  return new Aws.RouteTable({
    vpcId,
    tags
  });
}

export = workflow({
  input: {
    tags: {type: 'StringHash', lookup: 'aws.tags'}
  },

  output: {
    vpcId       : 'string',
    subnetId    : 'string',
    routetableId: 'string'
  },

  activities: {
    vpc: resource({
      output: ['vpc_id', 'subnet_id'],
      state : (tags: { [s: string]: string }): Aws.Vpc => new Aws.Vpc({
        amazonProvidedIpv6CidrBlock: false,
        cidrBlock                  : '192.168.0.0/16',
        enableDnsHostnames         : false,
        enableDnsSupport           : false,
        isDefault                  : false,
        state                      : 'available',
        tags,
      })
    }),

    vpcDone: action({
      do: (vpcId: string): { vpcOk: boolean } => {
        console.log(`created vpc with id ${vpcId}`);
        return {vpcOk: true};
      }
    }),

    subnet: resource({
      output: 'subnet_id',
      state : (vpcId: string, tags: { [s: string]: string }) => new Aws.Subnet({
        vpcId,
        tags,
        cidrBlock                  : '192.168.1.0/24',
        ipv6CidrBlock              : "",
        assignIpv6AddressOnCreation: false,
        mapPublicIpOnLaunch        : false,
        defaultForAz               : false,
        state                      : 'available'
      })
    }),

    routetable: resource({
      output: {routetable_id: 'string'},
      state : (vpcId: string, tags: { [s: string]: string }) => makeRouteTable(vpcId, tags)
    })
  }
});
