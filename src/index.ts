import {Service} from "./servicesdk/Service";
import {Sensitive} from "./pcore/Sensitive";
import {Namespace, TypedName} from "./pcore/TypedName";

const service = new Service({Sensitive, TypedName}, new TypedName(Namespace.NsService, 'Lyra::Workflow'), 2000, 21000);
service.start();
