/// <reference types="jest" />

import {ManifestLoader} from "../lib/servicesdk/ManifestLoader";
import {Definition} from "../lib/servicesdk/ServiceBuilder";

describe('ManifestLoader', () => {
  it('loads manifest', () => {
    const l = new ManifestLoader();
    const d = l.loadManifest('dist/examples/vpc_with_subnet.js');
    console.log(d.toString());
    expect(d).toBeInstanceOf(Definition);
    expect(d.serviceId.name).toEqual('Dist::Examples::Vpc_with_subnetJs');
    const activities = d.properties['activities'];
    expect(activities).toBeDefined();
  });
});