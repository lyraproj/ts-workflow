import {action, resource, serveWorkflow} from '..';

import * as Aws from './Aws';

function makeRouteTable(vpcId: string, tags: {[s: string]: string}): Aws.RouteTable {
  return new Aws.RouteTable({vpcId, tags});
}

serveWorkflow({
  source: __filename,
  parameters: {tags: {type: 'StringHash', lookup: 'aws.tags'}},

  returns: {vpcId: 'string', subnetId: 'string', routeTableId: 'string'},

  steps: {
    vpc: resource({
      returns: 'vpcId',
      state: (tags: {[s: string]: string}): Aws.Vpc => new Aws.Vpc({
        amazonProvidedIpv6CidrBlock: false,
        cidrBlock: '192.168.0.0/16',
        enableDnsHostnames: false,
        enableDnsSupport: false,
        isDefault: false,
        state: 'available',
        tags,
      })
    }),

    vpcDone: action({
      do: (vpcId: string): {vpcOk: boolean} => {
        console.log(`created vpc with id ${vpcId}`);
        return {vpcOk: true};
      }
    }),

    subnet: resource({
      returns: 'subnetId',
      state: (vpcId: string, tags: {[s: string]: string}) => new Aws.Subnet({
        vpcId,
        tags,
        cidrBlock: '192.168.1.0/24',
        ipv6CidrBlock: '',
        assignIpv6AddressOnCreation: false,
        mapPublicIpOnLaunch: false,
        defaultForAz: false,
        state: 'available'
      })
    }),

    routeTable: resource({
      returns: {routeTableId: 'string'},
      state: (vpcId: string, tags: {[s: string]: string}) => makeRouteTable(vpcId, tags)
    })
  }
});
