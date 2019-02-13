/// <reference types="jest" />

import {extractTypeInfo} from "../src/servicesdk/ManifestTypes";

describe('inferWorkflowTypes', () => {
  it('finds types', () => {
    const tr = extractTypeInfo(['examples/vpc_with_subnet.ts']);

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
        routetable: {
          input: {
            tags: "{[s: string]: string}", vpcId: "string"
          },
          type: "Aws::RouteTable"
        }
      });
  });
});
