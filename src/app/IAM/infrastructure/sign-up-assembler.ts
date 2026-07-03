import {SignUpRequest} from './sign-up.request';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {SignUpResource, SignUpResponse} from './sign-up-response';

export class SignUpAssembler {
  toResourceFromResponse(response: SignUpResponse): SignUpResource {
    return {
      id: response.id,
      username: response.username,
      role: response.role,
    } as SignUpResource;
  }

  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      username: command.username,
      password: command.password,
      role: command.role,
    } as SignUpRequest;
  }
}
