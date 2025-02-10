import {
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

describe('AuthController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return a token and user data on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      };
      mockAuthService.login.mockResolvedValue({
        access_token: 'token',
        user: { id: '1', email: 'user@example.com', name: 'John Doe' },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        access_token: 'token',
        user: { id: '1', email: 'user@example.com', name: 'John Doe' },
      });
    });

    it('should return 401 if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /auth/register', () => {
    it('should create a new user and return user data', async () => {
      const registerDto: RegisterDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      };
      mockAuthService.register.mockResolvedValue({ id: '1', ...registerDto });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({ id: '1', ...registerDto });
    });

    it('should return 400 if input is invalid', async () => {
      const registerDto: RegisterDto = {
        email: 'invalid-email',
        password: 'short',
        name: 'John Doe',
      };
      mockAuthService.register.mockRejectedValue(
        new BadRequestException('Invalid input'),
      );

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
