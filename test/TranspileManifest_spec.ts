/// <reference types="jest" />

import {extractTypeInfo} from "../lib/servicesdk/ManifestTypes";
import {activityName} from "../lib";

describe('inferWorkflowTypes', () => {
  it('finds types', () => {
    const fn = 'lib/examples/vpc_with_subnet.js';
    const tr = extractTypeInfo(fn, ['lib/examples/vpc_with_subnet.ts']);

    expect(tr.inferredTypes).toEqual(
      {
        vpc: {
          input: {
            tags: "{[s: string]: string}"
          },
          type: "Aws::Vpc"
        },
        vpcDone: {
          input: {
            vpcId: "string"
          },
          output: {
            vpcOk: "boolean"
          }
        },
        subnet: {
          input: {
            tags: "{[s: string]: string}", vpcId: "string"
          },
          type: "Aws::Subnet"
        },
        routeTable: {
          input: {
            tags: "{[s: string]: string}", vpcId: "string"
          },
          type: "Aws::RouteTable"
        }
      });
  });
});
