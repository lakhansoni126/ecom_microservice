import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { IUser } from './interfaces/user.interface';
import { Logger } from 'winston';
import { mapProtoRoleToDbRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  async register(data: RegisterDto): Promise<{ user: IUser; token: string }> {
    try {
      this.logger.info('Registering new user', { email: data.email });
      
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new UnauthorizedException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          password: hashedPassword,
          role: mapProtoRoleToDbRole(data.role),
        },
      });

      const token = this.generateToken(user);
      
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword as IUser, token };
    } catch (error) {
      this.logger.error('Registration failed', { error, email: data.email });
      throw error;
    }
  }

  async login(data: LoginDto): Promise<{ user: IUser; token: string }> {
    try {
      this.logger.info('Attempting login', { email: data.email });
      
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken(user);
      
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword as IUser, token };
    } catch (error) {
      this.logger.error('Login failed', { error, email: data.email });
      throw error;
    }
  }

  async validateToken(token: string): Promise<IUser> {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as IUser;
    } catch (error) {
      this.logger.error('Token validation failed', { error });
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateToken(user: { id: string; email: string; role: string }): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '24h'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
