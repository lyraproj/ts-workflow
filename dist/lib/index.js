"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sensitive_1 = require("./pcore/Sensitive");
const TypedName_1 = require("./pcore/TypedName");
const Service_1 = require("./servicesdk/Service");
const service = new Service_1.Service({ Sensitive: Sensitive_1.Sensitive, TypedName: TypedName_1.TypedName }, new TypedName_1.TypedName(TypedName_1.Namespace.NsService, 'Lyra::Workflow'), 2000, 21000);
service.start();
//# sourceMappingURL=index.js.map