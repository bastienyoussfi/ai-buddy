import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token and user data on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      };
      const user = {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        password: { hash: await bcrypt.hash('password123', 10) },
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await authService.login(loginDto);
      expect(result).toEqual({
        access_token: 'token',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });

  describe('register', () => {
    it('should create a new user and return user data', async () => {
      const registerDto: RegisterDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
      });

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
      });

      // Get the actual call arguments
      const createCall = mockPrismaService.user.create.mock.calls[0][0];

      // Verify the structure without comparing the exact hash
      expect(createCall).toMatchObject({
        data: {
          email: registerDto.email,
          name: registerDto.name,
          password: {
            create: {
              hash: expect.any(String), // Only verify that hash is a string
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      // Verify the hash is a valid bcrypt hash
      const hash = createCall.data.password.create.hash;
      expect(hash).toMatch(/^\$2[abxy]\$\d+\$/); // bcrypt hash pattern
    });
  });
});
