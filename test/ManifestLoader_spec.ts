/// <reference types="jest" />

import {ManifestLoader} from "../src/servicesdk/ManifestLoader";
import {Definition} from "../src/servicesdk/ServiceBuilder";

describe('ManifestLoader', () => {
  it('loads manifest', () => {
    const l = new ManifestLoader();
    const d = l.loadManifest('build/examples/vpc_with_subnet.js');
    console.log(d.toString());
    expect(d).toBeInstanceOf(Definition);
    expect(d.serviceId.name).toEqual('Build::Examples::Vpc_with_subnetJs');
    const activities = d.properties['activities'];
    expect(activities).toBeDefined();
  });
});