"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BlockDeviceMapping {
    constructor({ deviceName = '', ebs = null, noDevice = '', virtualName = '' }) {
        this.deviceName = deviceName;
        this.ebs = ebs;
        this.noDevice = noDevice;
        this.virtualName = virtualName;
    }
    __pvalue() {
        const ih = {};
        if (this.deviceName !== '') {
            ih['deviceName'] = this.deviceName;
        }
        if (this.ebs !== null) {
            ih['ebs'] = this.ebs;
        }
        if (this.noDevice !== '') {
            ih['noDevice'] = this.noDevice;
        }
        if (this.virtualName !== '') {
            ih['virtualName'] = this.virtualName;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::BlockDeviceMapping';
    }
}
exports.BlockDeviceMapping = BlockDeviceMapping;
class CpuOptions {
    constructor({ coreCount = 0, threadsPerCore = 0 }) {
        this.coreCount = coreCount;
        this.threadsPerCore = threadsPerCore;
    }
    __pvalue() {
        const ih = {};
        if (this.coreCount !== 0) {
            ih['coreCount'] = this.coreCount;
        }
        if (this.threadsPerCore !== 0) {
            ih['threadsPerCore'] = this.threadsPerCore;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::CpuOptions';
    }
}
exports.CpuOptions = CpuOptions;
class EbsBlockDevice {
    constructor({ deleteOnTermination = false, encrypted = false, iops = 0, kmsKeyId = '', snapshotId = '', volumeSize = 0, volumeType = '' }) {
        this.deleteOnTermination = deleteOnTermination;
        this.encrypted = encrypted;
        this.iops = iops;
        this.kmsKeyId = kmsKeyId;
        this.snapshotId = snapshotId;
        this.volumeSize = volumeSize;
        this.volumeType = volumeType;
    }
    __pvalue() {
        const ih = {};
        if (this.deleteOnTermination !== false) {
            ih['deleteOnTermination'] = this.deleteOnTermination;
        }
        if (this.encrypted !== false) {
            ih['encrypted'] = this.encrypted;
        }
        if (this.iops !== 0) {
            ih['iops'] = this.iops;
        }
        if (this.kmsKeyId !== '') {
            ih['kmsKeyId'] = this.kmsKeyId;
        }
        if (this.snapshotId !== '') {
            ih['snapshotId'] = this.snapshotId;
        }
        if (this.volumeSize !== 0) {
            ih['volumeSize'] = this.volumeSize;
        }
        if (this.volumeType !== '') {
            ih['volumeType'] = this.volumeType;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::EbsBlockDevice';
    }
}
exports.EbsBlockDevice = EbsBlockDevice;
class GroupIdentifier {
    constructor({ groupId = '', groupName = '' }) {
        this.groupId = groupId;
        this.groupName = groupName;
    }
    __pvalue() {
        const ih = {};
        if (this.groupId !== '') {
            ih['groupId'] = this.groupId;
        }
        if (this.groupName !== '') {
            ih['groupName'] = this.groupName;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::GroupIdentifier';
    }
}
exports.GroupIdentifier = GroupIdentifier;
class IamInstanceProfile {
    constructor({ arn = '', name = '', id = '' }) {
        this.arn = arn;
        this.name = name;
        this.id = id;
    }
    __pvalue() {
        const ih = {};
        if (this.arn !== '') {
            ih['arn'] = this.arn;
        }
        if (this.name !== '') {
            ih['name'] = this.name;
        }
        if (this.id !== '') {
            ih['id'] = this.id;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::IamInstanceProfile';
    }
}
exports.IamInstanceProfile = IamInstanceProfile;
class IamRole {
    constructor({ roleName, assumeRolePolicyDocument, tags, description = null, path = null }) {
        this.roleName = roleName;
        this.assumeRolePolicyDocument = assumeRolePolicyDocument;
        this.tags = tags;
        this.description = description;
        this.path = path;
    }
    __pvalue() {
        const ih = {};
        ih['roleName'] = this.roleName;
        ih['assumeRolePolicyDocument'] = this.assumeRolePolicyDocument;
        ih['tags'] = this.tags;
        if (this.description !== null) {
            ih['description'] = this.description;
        }
        if (this.path !== null) {
            ih['path'] = this.path;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::IamRole';
    }
}
exports.IamRole = IamRole;
class Instance {
    constructor({ imageId, instanceType, maxCount, minCount, additionalInfo = '', blockDeviceMappings = [], clientToken = '', cpuOptions = null, disableApiTermination = false, ebsOptimized = false, iamInstanceProfile = null, instanceInitiatedShutdownBehavior = '', ipv6AddressCount = 0, ipv6Addresses = [], kernelId = '', keyName = '', launchTemplate = null, monitoring = null, placement = null, privateIpAddress = '', ramdiskId = '', subnetId = '', userData = '', ownerId = '', requesterId = '', reservationId = '', amiLaunchIndex = 0, architecture = '', enaSupport = false, hypervisor = '', instanceId = '', instanceLifecycle = '', platform = '', privateDnsName = '', productCodes = [], publicDnsName = '', publicIpAddress = '', ramDiskId = '', rootDeviceName = '', rootDeviceType = '', securityGroups = [], sourceDestCheck = false, spotInstanceRequestId = '', sriovNetSupport = '', state = null, stateReason = null, stateTransitionReason = '', tags, virtualizationType = '', vpcId = '' }) {
        this.imageId = imageId;
        this.instanceType = instanceType;
        this.maxCount = maxCount;
        this.minCount = minCount;
        this.additionalInfo = additionalInfo;
        this.blockDeviceMappings = blockDeviceMappings;
        this.clientToken = clientToken;
        this.cpuOptions = cpuOptions;
        this.disableApiTermination = disableApiTermination;
        this.ebsOptimized = ebsOptimized;
        this.iamInstanceProfile = iamInstanceProfile;
        this.instanceInitiatedShutdownBehavior = instanceInitiatedShutdownBehavior;
        this.ipv6AddressCount = ipv6AddressCount;
        this.ipv6Addresses = ipv6Addresses;
        this.kernelId = kernelId;
        this.keyName = keyName;
        this.launchTemplate = launchTemplate;
        this.monitoring = monitoring;
        this.placement = placement;
        this.privateIpAddress = privateIpAddress;
        this.ramdiskId = ramdiskId;
        this.subnetId = subnetId;
        this.userData = userData;
        this.ownerId = ownerId;
        this.requesterId = requesterId;
        this.reservationId = reservationId;
        this.amiLaunchIndex = amiLaunchIndex;
        this.architecture = architecture;
        this.enaSupport = enaSupport;
        this.hypervisor = hypervisor;
        this.instanceId = instanceId;
        this.instanceLifecycle = instanceLifecycle;
        this.platform = platform;
        this.privateDnsName = privateDnsName;
        this.productCodes = productCodes;
        this.publicDnsName = publicDnsName;
        this.publicIpAddress = publicIpAddress;
        this.ramDiskId = ramDiskId;
        this.rootDeviceName = rootDeviceName;
        this.rootDeviceType = rootDeviceType;
        this.securityGroups = securityGroups;
        this.sourceDestCheck = sourceDestCheck;
        this.spotInstanceRequestId = spotInstanceRequestId;
        this.sriovNetSupport = sriovNetSupport;
        this.state = state;
        this.stateReason = stateReason;
        this.stateTransitionReason = stateTransitionReason;
        this.tags = tags;
        this.virtualizationType = virtualizationType;
        this.vpcId = vpcId;
    }
    __pvalue() {
        const ih = {};
        ih['imageId'] = this.imageId;
        ih['instanceType'] = this.instanceType;
        ih['maxCount'] = this.maxCount;
        ih['minCount'] = this.minCount;
        if (this.additionalInfo !== '') {
            ih['additionalInfo'] = this.additionalInfo;
        }
        if (this.blockDeviceMappings !== []) {
            ih['blockDeviceMappings'] = this.blockDeviceMappings;
        }
        if (this.clientToken !== '') {
            ih['clientToken'] = this.clientToken;
        }
        if (this.cpuOptions !== null) {
            ih['cpuOptions'] = this.cpuOptions;
        }
        if (this.disableApiTermination !== false) {
            ih['disableApiTermination'] = this.disableApiTermination;
        }
        if (this.ebsOptimized !== false) {
            ih['ebsOptimized'] = this.ebsOptimized;
        }
        if (this.iamInstanceProfile !== null) {
            ih['iamInstanceProfile'] = this.iamInstanceProfile;
        }
        if (this.instanceInitiatedShutdownBehavior !== '') {
            ih['instanceInitiatedShutdownBehavior'] = this.instanceInitiatedShutdownBehavior;
        }
        if (this.ipv6AddressCount !== 0) {
            ih['ipv6AddressCount'] = this.ipv6AddressCount;
        }
        if (this.ipv6Addresses !== []) {
            ih['ipv6Addresses'] = this.ipv6Addresses;
        }
        if (this.kernelId !== '') {
            ih['kernelId'] = this.kernelId;
        }
        if (this.keyName !== '') {
            ih['keyName'] = this.keyName;
        }
        if (this.launchTemplate !== null) {
            ih['launchTemplate'] = this.launchTemplate;
        }
        if (this.monitoring !== null) {
            ih['monitoring'] = this.monitoring;
        }
        if (this.placement !== null) {
            ih['placement'] = this.placement;
        }
        if (this.privateIpAddress !== '') {
            ih['privateIpAddress'] = this.privateIpAddress;
        }
        if (this.ramdiskId !== '') {
            ih['ramdiskId'] = this.ramdiskId;
        }
        if (this.subnetId !== '') {
            ih['subnetId'] = this.subnetId;
        }
        if (this.userData !== '') {
            ih['userData'] = this.userData;
        }
        if (this.ownerId !== '') {
            ih['ownerId'] = this.ownerId;
        }
        if (this.requesterId !== '') {
            ih['requesterId'] = this.requesterId;
        }
        if (this.reservationId !== '') {
            ih['reservationId'] = this.reservationId;
        }
        if (this.amiLaunchIndex !== 0) {
            ih['amiLaunchIndex'] = this.amiLaunchIndex;
        }
        if (this.architecture !== '') {
            ih['architecture'] = this.architecture;
        }
        if (this.enaSupport !== false) {
            ih['enaSupport'] = this.enaSupport;
        }
        if (this.hypervisor !== '') {
            ih['hypervisor'] = this.hypervisor;
        }
        if (this.instanceId !== '') {
            ih['instanceId'] = this.instanceId;
        }
        if (this.instanceLifecycle !== '') {
            ih['instanceLifecycle'] = this.instanceLifecycle;
        }
        if (this.platform !== '') {
            ih['platform'] = this.platform;
        }
        if (this.privateDnsName !== '') {
            ih['privateDnsName'] = this.privateDnsName;
        }
        if (this.productCodes !== []) {
            ih['productCodes'] = this.productCodes;
        }
        if (this.publicDnsName !== '') {
            ih['publicDnsName'] = this.publicDnsName;
        }
        if (this.publicIpAddress !== '') {
            ih['publicIpAddress'] = this.publicIpAddress;
        }
        if (this.ramDiskId !== '') {
            ih['ramDiskId'] = this.ramDiskId;
        }
        if (this.rootDeviceName !== '') {
            ih['rootDeviceName'] = this.rootDeviceName;
        }
        if (this.rootDeviceType !== '') {
            ih['rootDeviceType'] = this.rootDeviceType;
        }
        if (this.securityGroups !== []) {
            ih['securityGroups'] = this.securityGroups;
        }
        if (this.sourceDestCheck !== false) {
            ih['sourceDestCheck'] = this.sourceDestCheck;
        }
        if (this.spotInstanceRequestId !== '') {
            ih['spotInstanceRequestId'] = this.spotInstanceRequestId;
        }
        if (this.sriovNetSupport !== '') {
            ih['sriovNetSupport'] = this.sriovNetSupport;
        }
        if (this.state !== null) {
            ih['state'] = this.state;
        }
        if (this.stateReason !== null) {
            ih['stateReason'] = this.stateReason;
        }
        if (this.stateTransitionReason !== '') {
            ih['stateTransitionReason'] = this.stateTransitionReason;
        }
        ih['tags'] = this.tags;
        if (this.virtualizationType !== '') {
            ih['virtualizationType'] = this.virtualizationType;
        }
        if (this.vpcId !== '') {
            ih['vpcId'] = this.vpcId;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::Instance';
    }
}
exports.Instance = Instance;
class InstanceHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::InstanceHandler';
    }
}
exports.InstanceHandler = InstanceHandler;
class InstanceIpv6Address {
    constructor({ ipv6Address = '' }) {
        this.ipv6Address = ipv6Address;
    }
    __pvalue() {
        const ih = {};
        if (this.ipv6Address !== '') {
            ih['ipv6Address'] = this.ipv6Address;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::InstanceIpv6Address';
    }
}
exports.InstanceIpv6Address = InstanceIpv6Address;
class InstanceState {
    constructor({ code = 0, name = '' }) {
        this.code = code;
        this.name = name;
    }
    __pvalue() {
        const ih = {};
        if (this.code !== 0) {
            ih['code'] = this.code;
        }
        if (this.name !== '') {
            ih['name'] = this.name;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::InstanceState';
    }
}
exports.InstanceState = InstanceState;
class InternetGateway {
    constructor({ tags, internetGatewayId = null, attachments = [] }) {
        this.tags = tags;
        this.internetGatewayId = internetGatewayId;
        this.attachments = attachments;
    }
    __pvalue() {
        const ih = {};
        ih['tags'] = this.tags;
        if (this.internetGatewayId !== null) {
            ih['internetGatewayId'] = this.internetGatewayId;
        }
        if (this.attachments !== []) {
            ih['attachments'] = this.attachments;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::InternetGateway';
    }
}
exports.InternetGateway = InternetGateway;
class InternetGatewayAttachment {
    constructor({ state, vpcId }) {
        this.state = state;
        this.vpcId = vpcId;
    }
    __pvalue() {
        const ih = {};
        ih['state'] = this.state;
        ih['vpcId'] = this.vpcId;
        return ih;
    }
    __ptype() {
        return 'Aws::InternetGatewayAttachment';
    }
}
exports.InternetGatewayAttachment = InternetGatewayAttachment;
class InternetGatewayHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::InternetGatewayHandler';
    }
}
exports.InternetGatewayHandler = InternetGatewayHandler;
class IpPermission {
    constructor({ fromPort = 0, ipProtocol = '', ipRanges = [], ipv6Ranges = [], prefixListIds = [], toPort = 0, userIdGroupPairs = [] }) {
        this.fromPort = fromPort;
        this.ipProtocol = ipProtocol;
        this.ipRanges = ipRanges;
        this.ipv6Ranges = ipv6Ranges;
        this.prefixListIds = prefixListIds;
        this.toPort = toPort;
        this.userIdGroupPairs = userIdGroupPairs;
    }
    __pvalue() {
        const ih = {};
        if (this.fromPort !== 0) {
            ih['fromPort'] = this.fromPort;
        }
        if (this.ipProtocol !== '') {
            ih['ipProtocol'] = this.ipProtocol;
        }
        if (this.ipRanges !== []) {
            ih['ipRanges'] = this.ipRanges;
        }
        if (this.ipv6Ranges !== []) {
            ih['ipv6Ranges'] = this.ipv6Ranges;
        }
        if (this.prefixListIds !== []) {
            ih['prefixListIds'] = this.prefixListIds;
        }
        if (this.toPort !== 0) {
            ih['toPort'] = this.toPort;
        }
        if (this.userIdGroupPairs !== []) {
            ih['userIdGroupPairs'] = this.userIdGroupPairs;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::IpPermission';
    }
}
exports.IpPermission = IpPermission;
class IpRange {
    constructor({ cidrIp = '', description = '' }) {
        this.cidrIp = cidrIp;
        this.description = description;
    }
    __pvalue() {
        const ih = {};
        if (this.cidrIp !== '') {
            ih['cidrIp'] = this.cidrIp;
        }
        if (this.description !== '') {
            ih['description'] = this.description;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::IpRange';
    }
}
exports.IpRange = IpRange;
class Ipv6Range {
    constructor({ cidrIpv6 = '', description = '' }) {
        this.cidrIpv6 = cidrIpv6;
        this.description = description;
    }
    __pvalue() {
        const ih = {};
        if (this.cidrIpv6 !== '') {
            ih['cidrIpv6'] = this.cidrIpv6;
        }
        if (this.description !== '') {
            ih['description'] = this.description;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::Ipv6Range';
    }
}
exports.Ipv6Range = Ipv6Range;
class KeyPair {
    constructor({ publicKeyMaterial, keyName, keyFingerprint = '' }) {
        this.publicKeyMaterial = publicKeyMaterial;
        this.keyName = keyName;
        this.keyFingerprint = keyFingerprint;
    }
    __pvalue() {
        const ih = {};
        ih['publicKeyMaterial'] = this.publicKeyMaterial;
        ih['keyName'] = this.keyName;
        if (this.keyFingerprint !== '') {
            ih['keyFingerprint'] = this.keyFingerprint;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::KeyPair';
    }
}
exports.KeyPair = KeyPair;
class KeyPairHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::KeyPairHandler';
    }
}
exports.KeyPairHandler = KeyPairHandler;
class LaunchTemplateSpecification {
    constructor({ launchTemplateId = '', launchTemplateName = '', version = '' }) {
        this.launchTemplateId = launchTemplateId;
        this.launchTemplateName = launchTemplateName;
        this.version = version;
    }
    __pvalue() {
        const ih = {};
        if (this.launchTemplateId !== '') {
            ih['launchTemplateId'] = this.launchTemplateId;
        }
        if (this.launchTemplateName !== '') {
            ih['launchTemplateName'] = this.launchTemplateName;
        }
        if (this.version !== '') {
            ih['version'] = this.version;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::LaunchTemplateSpecification';
    }
}
exports.LaunchTemplateSpecification = LaunchTemplateSpecification;
class Monitoring {
    constructor({ enabled = false, state = '' }) {
        this.enabled = enabled;
        this.state = state;
    }
    __pvalue() {
        const ih = {};
        if (this.enabled !== false) {
            ih['enabled'] = this.enabled;
        }
        if (this.state !== '') {
            ih['state'] = this.state;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::Monitoring';
    }
}
exports.Monitoring = Monitoring;
class NativeInstanceHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::NativeInstanceHandler';
    }
}
exports.NativeInstanceHandler = NativeInstanceHandler;
class NativeInternetGatewayHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::NativeInternetGatewayHandler';
    }
}
exports.NativeInternetGatewayHandler = NativeInternetGatewayHandler;
class NativeRouteTableHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::NativeRouteTableHandler';
    }
}
exports.NativeRouteTableHandler = NativeRouteTableHandler;
class NativeSecurityGroupHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::NativeSecurityGroupHandler';
    }
}
exports.NativeSecurityGroupHandler = NativeSecurityGroupHandler;
class NativeSubnetHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::NativeSubnetHandler';
    }
}
exports.NativeSubnetHandler = NativeSubnetHandler;
class NativeVpcHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::NativeVpcHandler';
    }
}
exports.NativeVpcHandler = NativeVpcHandler;
class Placement {
    constructor({ affinity = '', availabilityZone = '', groupName = '', hostId = '', spreadDomain = '', tenancy = '' }) {
        this.affinity = affinity;
        this.availabilityZone = availabilityZone;
        this.groupName = groupName;
        this.hostId = hostId;
        this.spreadDomain = spreadDomain;
        this.tenancy = tenancy;
    }
    __pvalue() {
        const ih = {};
        if (this.affinity !== '') {
            ih['affinity'] = this.affinity;
        }
        if (this.availabilityZone !== '') {
            ih['availabilityZone'] = this.availabilityZone;
        }
        if (this.groupName !== '') {
            ih['groupName'] = this.groupName;
        }
        if (this.hostId !== '') {
            ih['hostId'] = this.hostId;
        }
        if (this.spreadDomain !== '') {
            ih['spreadDomain'] = this.spreadDomain;
        }
        if (this.tenancy !== '') {
            ih['tenancy'] = this.tenancy;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::Placement';
    }
}
exports.Placement = Placement;
class PrefixListId {
    constructor({ description = '', prefixListId = '' }) {
        this.description = description;
        this.prefixListId = prefixListId;
    }
    __pvalue() {
        const ih = {};
        if (this.description !== '') {
            ih['description'] = this.description;
        }
        if (this.prefixListId !== '') {
            ih['prefixListId'] = this.prefixListId;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::PrefixListId';
    }
}
exports.PrefixListId = PrefixListId;
class ProductCode {
    constructor({ productCodeId = '', productCodeType = '' }) {
        this.productCodeId = productCodeId;
        this.productCodeType = productCodeType;
    }
    __pvalue() {
        const ih = {};
        if (this.productCodeId !== '') {
            ih['productCodeId'] = this.productCodeId;
        }
        if (this.productCodeType !== '') {
            ih['productCodeType'] = this.productCodeType;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::ProductCode';
    }
}
exports.ProductCode = ProductCode;
class PropagatingVgw {
    constructor({ gatewayId }) {
        this.gatewayId = gatewayId;
    }
    __pvalue() {
        const ih = {};
        ih['gatewayId'] = this.gatewayId;
        return ih;
    }
    __ptype() {
        return 'Aws::PropagatingVgw';
    }
}
exports.PropagatingVgw = PropagatingVgw;
class RoleHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::RoleHandler';
    }
}
exports.RoleHandler = RoleHandler;
class Route {
    constructor({ tags, destinationCidrBlock = '', destinationIpv6CidrBlock = '', destinationPrefixListId = '', egressOnlyInternetGatewayId = '', gatewayId = '', instanceId = '', instanceOwnerId = '', natGatewayId = '', networkInterfaceId = '', origin = '', state = '', vpcPeeringConnectionId = '' }) {
        this.tags = tags;
        this.destinationCidrBlock = destinationCidrBlock;
        this.destinationIpv6CidrBlock = destinationIpv6CidrBlock;
        this.destinationPrefixListId = destinationPrefixListId;
        this.egressOnlyInternetGatewayId = egressOnlyInternetGatewayId;
        this.gatewayId = gatewayId;
        this.instanceId = instanceId;
        this.instanceOwnerId = instanceOwnerId;
        this.natGatewayId = natGatewayId;
        this.networkInterfaceId = networkInterfaceId;
        this.origin = origin;
        this.state = state;
        this.vpcPeeringConnectionId = vpcPeeringConnectionId;
    }
    __pvalue() {
        const ih = {};
        ih['tags'] = this.tags;
        if (this.destinationCidrBlock !== '') {
            ih['destinationCidrBlock'] = this.destinationCidrBlock;
        }
        if (this.destinationIpv6CidrBlock !== '') {
            ih['destinationIpv6CidrBlock'] = this.destinationIpv6CidrBlock;
        }
        if (this.destinationPrefixListId !== '') {
            ih['destinationPrefixListId'] = this.destinationPrefixListId;
        }
        if (this.egressOnlyInternetGatewayId !== '') {
            ih['egressOnlyInternetGatewayId'] = this.egressOnlyInternetGatewayId;
        }
        if (this.gatewayId !== '') {
            ih['gatewayId'] = this.gatewayId;
        }
        if (this.instanceId !== '') {
            ih['instanceId'] = this.instanceId;
        }
        if (this.instanceOwnerId !== '') {
            ih['instanceOwnerId'] = this.instanceOwnerId;
        }
        if (this.natGatewayId !== '') {
            ih['natGatewayId'] = this.natGatewayId;
        }
        if (this.networkInterfaceId !== '') {
            ih['networkInterfaceId'] = this.networkInterfaceId;
        }
        if (this.origin !== '') {
            ih['origin'] = this.origin;
        }
        if (this.state !== '') {
            ih['state'] = this.state;
        }
        if (this.vpcPeeringConnectionId !== '') {
            ih['vpcPeeringConnectionId'] = this.vpcPeeringConnectionId;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::Route';
    }
}
exports.Route = Route;
class RouteTable {
    constructor({ vpcId, tags, routeTableId = null, subnetId = null, routes = [], associations = [], propagatingVgws = [] }) {
        this.vpcId = vpcId;
        this.tags = tags;
        this.routeTableId = routeTableId;
        this.subnetId = subnetId;
        this.routes = routes;
        this.associations = associations;
        this.propagatingVgws = propagatingVgws;
    }
    __pvalue() {
        const ih = {};
        ih['vpcId'] = this.vpcId;
        ih['tags'] = this.tags;
        if (this.routeTableId !== null) {
            ih['routeTableId'] = this.routeTableId;
        }
        if (this.subnetId !== null) {
            ih['subnetId'] = this.subnetId;
        }
        if (this.routes !== []) {
            ih['routes'] = this.routes;
        }
        if (this.associations !== []) {
            ih['associations'] = this.associations;
        }
        if (this.propagatingVgws !== []) {
            ih['propagatingVgws'] = this.propagatingVgws;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::RouteTable';
    }
}
exports.RouteTable = RouteTable;
class RouteTableAssociation {
    constructor({ main, routeTableId, subnetId, routeTableAssociationId = null }) {
        this.main = main;
        this.routeTableId = routeTableId;
        this.subnetId = subnetId;
        this.routeTableAssociationId = routeTableAssociationId;
    }
    __pvalue() {
        const ih = {};
        ih['main'] = this.main;
        ih['routeTableId'] = this.routeTableId;
        ih['subnetId'] = this.subnetId;
        if (this.routeTableAssociationId !== null) {
            ih['routeTableAssociationId'] = this.routeTableAssociationId;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::RouteTableAssociation';
    }
}
exports.RouteTableAssociation = RouteTableAssociation;
class RouteTableHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::RouteTableHandler';
    }
}
exports.RouteTableHandler = RouteTableHandler;
class SecurityGroup {
    constructor({ description, groupName, vpcId = '', groupId = '', ipPermissions = [], ipPermissionsEgress = [], ownerId = '', tags }) {
        this.description = description;
        this.groupName = groupName;
        this.vpcId = vpcId;
        this.groupId = groupId;
        this.ipPermissions = ipPermissions;
        this.ipPermissionsEgress = ipPermissionsEgress;
        this.ownerId = ownerId;
        this.tags = tags;
    }
    __pvalue() {
        const ih = {};
        ih['description'] = this.description;
        ih['groupName'] = this.groupName;
        if (this.vpcId !== '') {
            ih['vpcId'] = this.vpcId;
        }
        if (this.groupId !== '') {
            ih['groupId'] = this.groupId;
        }
        if (this.ipPermissions !== []) {
            ih['ipPermissions'] = this.ipPermissions;
        }
        if (this.ipPermissionsEgress !== []) {
            ih['ipPermissionsEgress'] = this.ipPermissionsEgress;
        }
        if (this.ownerId !== '') {
            ih['ownerId'] = this.ownerId;
        }
        ih['tags'] = this.tags;
        return ih;
    }
    __ptype() {
        return 'Aws::SecurityGroup';
    }
}
exports.SecurityGroup = SecurityGroup;
class SecurityGroupHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::SecurityGroupHandler';
    }
}
exports.SecurityGroupHandler = SecurityGroupHandler;
class StateReason {
    constructor({ code = '', message = '' }) {
        this.code = code;
        this.message = message;
    }
    __pvalue() {
        const ih = {};
        if (this.code !== '') {
            ih['code'] = this.code;
        }
        if (this.message !== '') {
            ih['message'] = this.message;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::StateReason';
    }
}
exports.StateReason = StateReason;
class Subnet {
    constructor({ vpcId, cidrBlock, ipv6CidrBlock, tags, assignIpv6AddressOnCreation, mapPublicIpOnLaunch, defaultForAz, state, availabilityZone = null, availableIpAddressCount = null, subnetId = null }) {
        this.vpcId = vpcId;
        this.cidrBlock = cidrBlock;
        this.ipv6CidrBlock = ipv6CidrBlock;
        this.tags = tags;
        this.assignIpv6AddressOnCreation = assignIpv6AddressOnCreation;
        this.mapPublicIpOnLaunch = mapPublicIpOnLaunch;
        this.defaultForAz = defaultForAz;
        this.state = state;
        this.availabilityZone = availabilityZone;
        this.availableIpAddressCount = availableIpAddressCount;
        this.subnetId = subnetId;
    }
    __pvalue() {
        const ih = {};
        ih['vpcId'] = this.vpcId;
        ih['cidrBlock'] = this.cidrBlock;
        ih['ipv6CidrBlock'] = this.ipv6CidrBlock;
        ih['tags'] = this.tags;
        ih['assignIpv6AddressOnCreation'] = this.assignIpv6AddressOnCreation;
        ih['mapPublicIpOnLaunch'] = this.mapPublicIpOnLaunch;
        ih['defaultForAz'] = this.defaultForAz;
        ih['state'] = this.state;
        if (this.availabilityZone !== null) {
            ih['availabilityZone'] = this.availabilityZone;
        }
        if (this.availableIpAddressCount !== null) {
            ih['availableIpAddressCount'] = this.availableIpAddressCount;
        }
        if (this.subnetId !== null) {
            ih['subnetId'] = this.subnetId;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::Subnet';
    }
}
exports.Subnet = Subnet;
class SubnetHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::SubnetHandler';
    }
}
exports.SubnetHandler = SubnetHandler;
class UserIdGroupPair {
    constructor({ description = '', groupId = '', groupName = '', peeringStatus = '', userId = '', vpcId = '', vpcPeeringConnectionId = '' }) {
        this.description = description;
        this.groupId = groupId;
        this.groupName = groupName;
        this.peeringStatus = peeringStatus;
        this.userId = userId;
        this.vpcId = vpcId;
        this.vpcPeeringConnectionId = vpcPeeringConnectionId;
    }
    __pvalue() {
        const ih = {};
        if (this.description !== '') {
            ih['description'] = this.description;
        }
        if (this.groupId !== '') {
            ih['groupId'] = this.groupId;
        }
        if (this.groupName !== '') {
            ih['groupName'] = this.groupName;
        }
        if (this.peeringStatus !== '') {
            ih['peeringStatus'] = this.peeringStatus;
        }
        if (this.userId !== '') {
            ih['userId'] = this.userId;
        }
        if (this.vpcId !== '') {
            ih['vpcId'] = this.vpcId;
        }
        if (this.vpcPeeringConnectionId !== '') {
            ih['vpcPeeringConnectionId'] = this.vpcPeeringConnectionId;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::UserIdGroupPair';
    }
}
exports.UserIdGroupPair = UserIdGroupPair;
class VPCHandler {
    __pvalue() {
        return {};
    }
    __ptype() {
        return 'Aws::VPCHandler';
    }
}
exports.VPCHandler = VPCHandler;
class Vpc {
    constructor({ amazonProvidedIpv6CidrBlock, cidrBlock, enableDnsHostnames, enableDnsSupport, tags, isDefault, state, instanceTenancy = 'default', vpcId = null, dhcpOptionsId = null }) {
        this.amazonProvidedIpv6CidrBlock = amazonProvidedIpv6CidrBlock;
        this.cidrBlock = cidrBlock;
        this.enableDnsHostnames = enableDnsHostnames;
        this.enableDnsSupport = enableDnsSupport;
        this.tags = tags;
        this.isDefault = isDefault;
        this.state = state;
        this.instanceTenancy = instanceTenancy;
        this.vpcId = vpcId;
        this.dhcpOptionsId = dhcpOptionsId;
    }
    __pvalue() {
        const ih = {};
        ih['amazonProvidedIpv6CidrBlock'] = this.amazonProvidedIpv6CidrBlock;
        ih['cidrBlock'] = this.cidrBlock;
        ih['enableDnsHostnames'] = this.enableDnsHostnames;
        ih['enableDnsSupport'] = this.enableDnsSupport;
        ih['tags'] = this.tags;
        ih['isDefault'] = this.isDefault;
        ih['state'] = this.state;
        if (this.instanceTenancy !== 'default') {
            ih['instanceTenancy'] = this.instanceTenancy;
        }
        if (this.vpcId !== null) {
            ih['vpcId'] = this.vpcId;
        }
        if (this.dhcpOptionsId !== null) {
            ih['dhcpOptionsId'] = this.dhcpOptionsId;
        }
        return ih;
    }
    __ptype() {
        return 'Aws::Vpc';
    }
}
exports.Vpc = Vpc;
//# sourceMappingURL=Aws.js.map