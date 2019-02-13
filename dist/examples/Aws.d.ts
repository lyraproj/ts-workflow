import { PcoreValue } from '../lib/pcore/Serializer';
import { Value } from '../lib/pcore/Util';
export declare class BlockDeviceMapping implements PcoreValue {
    readonly deviceName: string;
    readonly ebs: EbsBlockDevice | null;
    readonly noDevice: string;
    readonly virtualName: string;
    constructor({ deviceName, ebs, noDevice, virtualName }: {
        deviceName?: string;
        ebs?: EbsBlockDevice | null;
        noDevice?: string;
        virtualName?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class CpuOptions implements PcoreValue {
    readonly coreCount: number;
    readonly threadsPerCore: number;
    constructor({ coreCount, threadsPerCore }: {
        coreCount?: number;
        threadsPerCore?: number;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class EbsBlockDevice implements PcoreValue {
    readonly deleteOnTermination: boolean;
    readonly encrypted: boolean;
    readonly iops: number;
    readonly kmsKeyId: string;
    readonly snapshotId: string;
    readonly volumeSize: number;
    readonly volumeType: string;
    constructor({ deleteOnTermination, encrypted, iops, kmsKeyId, snapshotId, volumeSize, volumeType }: {
        deleteOnTermination?: boolean;
        encrypted?: boolean;
        iops?: number;
        kmsKeyId?: string;
        snapshotId?: string;
        volumeSize?: number;
        volumeType?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class GroupIdentifier implements PcoreValue {
    readonly groupId: string;
    readonly groupName: string;
    constructor({ groupId, groupName }: {
        groupId?: string;
        groupName?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class IamInstanceProfile implements PcoreValue {
    readonly arn: string;
    readonly name: string;
    readonly id: string;
    constructor({ arn, name, id }: {
        arn?: string;
        name?: string;
        id?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class IamRole implements PcoreValue {
    readonly roleName: string;
    readonly assumeRolePolicyDocument: string;
    readonly tags: {
        [s: string]: string;
    };
    readonly description: string | null;
    readonly path: string | null;
    constructor({ roleName, assumeRolePolicyDocument, tags, description, path }: {
        roleName: string;
        assumeRolePolicyDocument: string;
        tags: {
            [s: string]: string;
        };
        description?: string | null;
        path?: string | null;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class Instance implements PcoreValue {
    readonly imageId: string;
    readonly instanceType: string;
    readonly maxCount: number;
    readonly minCount: number;
    readonly additionalInfo: string;
    readonly blockDeviceMappings: BlockDeviceMapping[];
    readonly clientToken: string;
    readonly cpuOptions: CpuOptions | null;
    readonly disableApiTermination: boolean;
    readonly ebsOptimized: boolean;
    readonly iamInstanceProfile: IamInstanceProfile | null;
    readonly instanceInitiatedShutdownBehavior: string;
    readonly ipv6AddressCount: number;
    readonly ipv6Addresses: InstanceIpv6Address[];
    readonly kernelId: string;
    readonly keyName: string;
    readonly launchTemplate: LaunchTemplateSpecification | null;
    readonly monitoring: Monitoring | null;
    readonly placement: Placement | null;
    readonly privateIpAddress: string;
    readonly ramdiskId: string;
    readonly subnetId: string;
    readonly userData: string;
    readonly ownerId: string;
    readonly requesterId: string;
    readonly reservationId: string;
    readonly amiLaunchIndex: number;
    readonly architecture: string;
    readonly enaSupport: boolean;
    readonly hypervisor: string;
    readonly instanceId: string;
    readonly instanceLifecycle: string;
    readonly platform: string;
    readonly privateDnsName: string;
    readonly productCodes: ProductCode[];
    readonly publicDnsName: string;
    readonly publicIpAddress: string;
    readonly ramDiskId: string;
    readonly rootDeviceName: string;
    readonly rootDeviceType: string;
    readonly securityGroups: GroupIdentifier[];
    readonly sourceDestCheck: boolean;
    readonly spotInstanceRequestId: string;
    readonly sriovNetSupport: string;
    readonly state: InstanceState | null;
    readonly stateReason: StateReason | null;
    readonly stateTransitionReason: string;
    readonly tags: {
        [s: string]: string;
    } | null;
    readonly virtualizationType: string;
    readonly vpcId: string;
    constructor({ imageId, instanceType, maxCount, minCount, additionalInfo, blockDeviceMappings, clientToken, cpuOptions, disableApiTermination, ebsOptimized, iamInstanceProfile, instanceInitiatedShutdownBehavior, ipv6AddressCount, ipv6Addresses, kernelId, keyName, launchTemplate, monitoring, placement, privateIpAddress, ramdiskId, subnetId, userData, ownerId, requesterId, reservationId, amiLaunchIndex, architecture, enaSupport, hypervisor, instanceId, instanceLifecycle, platform, privateDnsName, productCodes, publicDnsName, publicIpAddress, ramDiskId, rootDeviceName, rootDeviceType, securityGroups, sourceDestCheck, spotInstanceRequestId, sriovNetSupport, state, stateReason, stateTransitionReason, tags, virtualizationType, vpcId }: {
        imageId: string;
        instanceType: string;
        maxCount: number;
        minCount: number;
        additionalInfo?: string;
        blockDeviceMappings?: BlockDeviceMapping[];
        clientToken?: string;
        cpuOptions?: CpuOptions | null;
        disableApiTermination?: boolean;
        ebsOptimized?: boolean;
        iamInstanceProfile?: IamInstanceProfile | null;
        instanceInitiatedShutdownBehavior?: string;
        ipv6AddressCount?: number;
        ipv6Addresses?: InstanceIpv6Address[];
        kernelId?: string;
        keyName?: string;
        launchTemplate?: LaunchTemplateSpecification | null;
        monitoring?: Monitoring | null;
        placement?: Placement | null;
        privateIpAddress?: string;
        ramdiskId?: string;
        subnetId?: string;
        userData?: string;
        ownerId?: string;
        requesterId?: string;
        reservationId?: string;
        amiLaunchIndex?: number;
        architecture?: string;
        enaSupport?: boolean;
        hypervisor?: string;
        instanceId?: string;
        instanceLifecycle?: string;
        platform?: string;
        privateDnsName?: string;
        productCodes?: ProductCode[];
        publicDnsName?: string;
        publicIpAddress?: string;
        ramDiskId?: string;
        rootDeviceName?: string;
        rootDeviceType?: string;
        securityGroups?: GroupIdentifier[];
        sourceDestCheck?: boolean;
        spotInstanceRequestId?: string;
        sriovNetSupport?: string;
        state?: InstanceState | null;
        stateReason?: StateReason | null;
        stateTransitionReason?: string;
        tags: {
            [s: string]: string;
        } | null;
        virtualizationType?: string;
        vpcId?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class InstanceHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class InstanceIpv6Address implements PcoreValue {
    readonly ipv6Address: string;
    constructor({ ipv6Address }: {
        ipv6Address?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class InstanceState implements PcoreValue {
    readonly code: number;
    readonly name: string;
    constructor({ code, name }: {
        code?: number;
        name?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class InternetGateway implements PcoreValue {
    readonly tags: {
        [s: string]: string;
    };
    readonly internetGatewayId: string | null;
    readonly attachments: InternetGatewayAttachment[];
    constructor({ tags, internetGatewayId, attachments }: {
        tags: {
            [s: string]: string;
        };
        internetGatewayId?: string | null;
        attachments?: InternetGatewayAttachment[];
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class InternetGatewayAttachment implements PcoreValue {
    readonly state: string;
    readonly vpcId: string;
    constructor({ state, vpcId }: {
        state: string;
        vpcId: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class InternetGatewayHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class IpPermission implements PcoreValue {
    readonly fromPort: number;
    readonly ipProtocol: string;
    readonly ipRanges: IpRange[];
    readonly ipv6Ranges: Ipv6Range[];
    readonly prefixListIds: PrefixListId[];
    readonly toPort: number;
    readonly userIdGroupPairs: UserIdGroupPair[];
    constructor({ fromPort, ipProtocol, ipRanges, ipv6Ranges, prefixListIds, toPort, userIdGroupPairs }: {
        fromPort?: number;
        ipProtocol?: string;
        ipRanges?: IpRange[];
        ipv6Ranges?: Ipv6Range[];
        prefixListIds?: PrefixListId[];
        toPort?: number;
        userIdGroupPairs?: UserIdGroupPair[];
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class IpRange implements PcoreValue {
    readonly cidrIp: string;
    readonly description: string;
    constructor({ cidrIp, description }: {
        cidrIp?: string;
        description?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class Ipv6Range implements PcoreValue {
    readonly cidrIpv6: string;
    readonly description: string;
    constructor({ cidrIpv6, description }: {
        cidrIpv6?: string;
        description?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class KeyPair implements PcoreValue {
    readonly publicKeyMaterial: string;
    readonly keyName: string;
    readonly keyFingerprint: string;
    constructor({ publicKeyMaterial, keyName, keyFingerprint }: {
        publicKeyMaterial: string;
        keyName: string;
        keyFingerprint?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class KeyPairHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class LaunchTemplateSpecification implements PcoreValue {
    readonly launchTemplateId: string;
    readonly launchTemplateName: string;
    readonly version: string;
    constructor({ launchTemplateId, launchTemplateName, version }: {
        launchTemplateId?: string;
        launchTemplateName?: string;
        version?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class Monitoring implements PcoreValue {
    readonly enabled: boolean;
    readonly state: string;
    constructor({ enabled, state }: {
        enabled?: boolean;
        state?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class NativeInstanceHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class NativeInternetGatewayHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class NativeRouteTableHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class NativeSecurityGroupHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class NativeSubnetHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class NativeVpcHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class Placement implements PcoreValue {
    readonly affinity: string;
    readonly availabilityZone: string;
    readonly groupName: string;
    readonly hostId: string;
    readonly spreadDomain: string;
    readonly tenancy: string;
    constructor({ affinity, availabilityZone, groupName, hostId, spreadDomain, tenancy }: {
        affinity?: string;
        availabilityZone?: string;
        groupName?: string;
        hostId?: string;
        spreadDomain?: string;
        tenancy?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class PrefixListId implements PcoreValue {
    readonly description: string;
    readonly prefixListId: string;
    constructor({ description, prefixListId }: {
        description?: string;
        prefixListId?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class ProductCode implements PcoreValue {
    readonly productCodeId: string;
    readonly productCodeType: string;
    constructor({ productCodeId, productCodeType }: {
        productCodeId?: string;
        productCodeType?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class PropagatingVgw implements PcoreValue {
    readonly gatewayId: string;
    constructor({ gatewayId }: {
        gatewayId: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class RoleHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class Route implements PcoreValue {
    readonly tags: {
        [s: string]: string;
    };
    readonly destinationCidrBlock: string;
    readonly destinationIpv6CidrBlock: string;
    readonly destinationPrefixListId: string;
    readonly egressOnlyInternetGatewayId: string;
    readonly gatewayId: string;
    readonly instanceId: string;
    readonly instanceOwnerId: string;
    readonly natGatewayId: string;
    readonly networkInterfaceId: string;
    readonly origin: string;
    readonly state: string;
    readonly vpcPeeringConnectionId: string;
    constructor({ tags, destinationCidrBlock, destinationIpv6CidrBlock, destinationPrefixListId, egressOnlyInternetGatewayId, gatewayId, instanceId, instanceOwnerId, natGatewayId, networkInterfaceId, origin, state, vpcPeeringConnectionId }: {
        tags: {
            [s: string]: string;
        };
        destinationCidrBlock?: string;
        destinationIpv6CidrBlock?: string;
        destinationPrefixListId?: string;
        egressOnlyInternetGatewayId?: string;
        gatewayId?: string;
        instanceId?: string;
        instanceOwnerId?: string;
        natGatewayId?: string;
        networkInterfaceId?: string;
        origin?: string;
        state?: string;
        vpcPeeringConnectionId?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class RouteTable implements PcoreValue {
    readonly vpcId: string;
    readonly tags: {
        [s: string]: string;
    };
    readonly routeTableId: string | null;
    readonly subnetId: string | null;
    readonly routes: Route[];
    readonly associations: RouteTableAssociation[];
    readonly propagatingVgws: PropagatingVgw[];
    constructor({ vpcId, tags, routeTableId, subnetId, routes, associations, propagatingVgws }: {
        vpcId: string;
        tags: {
            [s: string]: string;
        };
        routeTableId?: string | null;
        subnetId?: string | null;
        routes?: Route[];
        associations?: RouteTableAssociation[];
        propagatingVgws?: PropagatingVgw[];
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class RouteTableAssociation implements PcoreValue {
    readonly main: boolean;
    readonly routeTableId: string;
    readonly subnetId: string;
    readonly routeTableAssociationId: string | null;
    constructor({ main, routeTableId, subnetId, routeTableAssociationId }: {
        main: boolean;
        routeTableId: string;
        subnetId: string;
        routeTableAssociationId?: string | null;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class RouteTableHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class SecurityGroup implements PcoreValue {
    readonly description: string;
    readonly groupName: string;
    readonly vpcId: string;
    readonly groupId: string;
    readonly ipPermissions: IpPermission[];
    readonly ipPermissionsEgress: IpPermission[];
    readonly ownerId: string;
    readonly tags: {
        [s: string]: string;
    } | null;
    constructor({ description, groupName, vpcId, groupId, ipPermissions, ipPermissionsEgress, ownerId, tags }: {
        description: string;
        groupName: string;
        vpcId?: string;
        groupId?: string;
        ipPermissions?: IpPermission[];
        ipPermissionsEgress?: IpPermission[];
        ownerId?: string;
        tags: {
            [s: string]: string;
        } | null;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class SecurityGroupHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class StateReason implements PcoreValue {
    readonly code: string;
    readonly message: string;
    constructor({ code, message }: {
        code?: string;
        message?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class Subnet implements PcoreValue {
    readonly vpcId: string;
    readonly cidrBlock: string;
    readonly ipv6CidrBlock: string;
    readonly tags: {
        [s: string]: string;
    };
    readonly assignIpv6AddressOnCreation: boolean;
    readonly mapPublicIpOnLaunch: boolean;
    readonly defaultForAz: boolean;
    readonly state: string;
    readonly availabilityZone: string | null;
    readonly availableIpAddressCount: number | null;
    readonly subnetId: string | null;
    constructor({ vpcId, cidrBlock, ipv6CidrBlock, tags, assignIpv6AddressOnCreation, mapPublicIpOnLaunch, defaultForAz, state, availabilityZone, availableIpAddressCount, subnetId }: {
        vpcId: string;
        cidrBlock: string;
        ipv6CidrBlock: string;
        tags: {
            [s: string]: string;
        };
        assignIpv6AddressOnCreation: boolean;
        mapPublicIpOnLaunch: boolean;
        defaultForAz: boolean;
        state: string;
        availabilityZone?: string | null;
        availableIpAddressCount?: number | null;
        subnetId?: string | null;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class SubnetHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class UserIdGroupPair implements PcoreValue {
    readonly description: string;
    readonly groupId: string;
    readonly groupName: string;
    readonly peeringStatus: string;
    readonly userId: string;
    readonly vpcId: string;
    readonly vpcPeeringConnectionId: string;
    constructor({ description, groupId, groupName, peeringStatus, userId, vpcId, vpcPeeringConnectionId }: {
        description?: string;
        groupId?: string;
        groupName?: string;
        peeringStatus?: string;
        userId?: string;
        vpcId?: string;
        vpcPeeringConnectionId?: string;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class VPCHandler implements PcoreValue {
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
export declare class Vpc implements PcoreValue {
    readonly amazonProvidedIpv6CidrBlock: boolean;
    readonly cidrBlock: string;
    readonly enableDnsHostnames: boolean;
    readonly enableDnsSupport: boolean;
    readonly tags: {
        [s: string]: string;
    };
    readonly isDefault: boolean;
    readonly state: string;
    readonly instanceTenancy: string | null;
    readonly vpcId: string | null;
    readonly dhcpOptionsId: string | null;
    constructor({ amazonProvidedIpv6CidrBlock, cidrBlock, enableDnsHostnames, enableDnsSupport, tags, isDefault, state, instanceTenancy, vpcId, dhcpOptionsId }: {
        amazonProvidedIpv6CidrBlock: boolean;
        cidrBlock: string;
        enableDnsHostnames: boolean;
        enableDnsSupport: boolean;
        tags: {
            [s: string]: string;
        };
        isDefault: boolean;
        state: string;
        instanceTenancy?: string | null;
        vpcId?: string | null;
        dhcpOptionsId?: string | null;
    });
    __pvalue(): {
        [s: string]: Value;
    };
    __ptype(): string;
}
