import { InMemoryDbService } from 'angular-in-memory-web-api';

import { data as servicesData } from '../responses/services.response';
import { data as modulesData } from '../responses/modules.response';
import { data as modelsData } from '../responses/models.response';

export class ApiService implements InMemoryDbService {
  createDb() {
    return {
      services: servicesData,
      modules: modulesData,
      utility: [
        {
          id: 'models',
          data: modelsData,
        }
      ]
    };
  }
}
