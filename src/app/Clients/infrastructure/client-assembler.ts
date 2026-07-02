import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Client, ClientStatus} from '../domain/model/client.entity';
import {ClientResource, ClientsResponse} from './clients-response';

export class ClientAssembler implements BaseAssembler<Client, ClientResource, ClientsResponse> {
  toEntitiesFromResponse(response: ClientsResponse): Client[] {
    return response.clients.map(resource => this.toEntityFromResource(resource as ClientResource));
  }

  toEntityFromResource(resource: ClientResource): Client {
    return new Client({
      id: resource.id,
      fullName: resource.fullName,
      lastName: resource.lastName,
      documentNumber: resource.documentNumber,
      email: resource.email,
      phone: resource.phone,
      monthlyIncome: resource.monthlyIncome,
      status: resource.status as ClientStatus
    });
  }

  toResourceFromEntity(entity: Client): ClientResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      lastName: entity.lastName,
      documentNumber: entity.documentNumber,
      email: entity.email,
      phone: entity.phone,
      monthlyIncome: entity.monthlyIncome,
      status: entity.status
    } as ClientResource;
  }
}
