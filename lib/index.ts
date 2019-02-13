import {Sensitive} from './pcore/Sensitive';
import {Namespace, TypedName} from './pcore/TypedName';
import {Service} from './servicesdk/Service';

const service = new Service({Sensitive, TypedName}, new TypedName(Namespace.NsService, 'Lyra::Workflow'), 2000, 21000);
service.start();
