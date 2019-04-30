/// <reference types="jest" />

import {extractTypeInfo} from "../lib/servicesdk/ManifestTypes";
import {stepName} from "../lib";

describe('inferWorkflowTypes', () => {
  it('finds types', () => {
    const fn = 'lib/examples/vpc_with_subnet.js';
    const tr = extractTypeInfo(fn, ['lib/examples/vpc_with_subnet.ts']);

    expect(tr.inferredTypes).toEqual(
      {
        vpc: {
          parameters: {
            tags: "{[s: string]: string}"
          },
          type: "Aws::Vpc"
        },
        vpcDone: {
          parameters: {
            vpcId: "string"
          },
          returns: {
            vpcOk: "boolean"
          }
        },
        subnet: {
          parameters: {
            tags: "{[s: string]: string}", vpcId: "string"
          },
          type: "Aws::Subnet"
        },
        routeTable: {
          parameters: {
            tags: "{[s: string]: string}", vpcId: "string"
          },
          type: "Aws::RouteTable"
        }
      });
  });
});
