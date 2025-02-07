import { ApiProperty } from '@nestjs/swagger';

export interface BaseApiResponse<T> {
  data: T;
  metadata: ResponseMetadata;
}

export class ResponseMetadata {
  @ApiProperty({ example: '2024-02-07T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/v1/users' })
  path!: string;

  @ApiProperty({ example: '1.0' })
  apiVersion?: string;
}

export interface PaginatedApiResponse<T> extends BaseApiResponse<T[]> {
  metadata: PaginationMetadata;
}

export class PaginationMetadata extends ResponseMetadata {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  perPage!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 10 })
  pageCount!: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}
