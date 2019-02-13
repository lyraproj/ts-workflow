"use strict";
const ServiceBuilder_1 = require("../lib/servicesdk/ServiceBuilder");
const Aws = require("./Aws");
function makeRouteTable(vpcId, tags) {
    return new Aws.RouteTable({ vpcId, tags });
}
module.exports = ServiceBuilder_1.workflow({
    input: { tags: { type: 'StringHash', lookup: 'aws.tags' } },
    output: { vpcId: 'string', subnetId: 'string', routetableId: 'string' },
    activities: {
        vpc: ServiceBuilder_1.resource({
            output: ['vpc_id', 'subnet_id'],
            state: (tags) => new Aws.Vpc({
                amazonProvidedIpv6CidrBlock: false,
                cidrBlock: '192.168.0.0/16',
                enableDnsHostnames: false,
                enableDnsSupport: false,
                isDefault: false,
                state: 'available',
                tags,
            })
        }),
        vpcDone: ServiceBuilder_1.action({
            do: (vpcId) => {
                console.log(`created vpc with id ${vpcId}`);
                return { vpcOk: true };
            }
        }),
        subnet: ServiceBuilder_1.resource({
            output: 'subnet_id',
            state: (vpcId, tags) => new Aws.Subnet({
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
        routetable: ServiceBuilder_1.resource({
            output: { routetable_id: 'string' },
            state: (vpcId, tags) => makeRouteTable(vpcId, tags)
        })
    }
});
//# sourceMappingURL=vpc_with_subnet.js.map