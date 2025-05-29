import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { 
  IGrpcService, 
  RegisterRequest, 
  RegisterResponse, 
  LoginRequest, 
  LoginResponse,
  ValidateTokenRequest, 
  ValidateTokenResponse 
} from './interfaces/grpc.interface';
import { mapDbRoleToProtoRole } from './enums/user-role.enum';

@Controller()
export class AuthController implements IGrpcService {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService')
  async Register(request: RegisterRequest): Promise<RegisterResponse> {
    const result = await this.authService.register({
      first_name: request.first_name,
      last_name: request.last_name,
      email: request.email,
      password: request.password,
      role: request.role
    });

    return {
      id: result.user.id,
      token: result.token
    };
  }

  @GrpcMethod('AuthService')
  async Login(request: LoginRequest): Promise<LoginResponse> {
    const result = await this.authService.login({
      email: request.email,
      password: request.password
    });

    return {
      token: result.token,
      user: {
        id: result.user.id,
        first_name: result.user.firstName,
        last_name: result.user.lastName,
        email: result.user.email,
        role: mapDbRoleToProtoRole(result.user.role),
        created_at: result.user.createdAt.toISOString(),
        updated_at: result.user.updatedAt.toISOString()
      }
    };
  }

  @GrpcMethod('AuthService')
  async ValidateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    const user = await this.authService.validateToken(request.token);
    return {
      valid: true,
      user: {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        role: mapDbRoleToProtoRole(user.role),
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString()
      }
    };
  }
}
