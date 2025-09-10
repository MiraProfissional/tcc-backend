import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    // Injecting request
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const page = paginationQueryDto.page ?? 1;
    const limit = paginationQueryDto.limit ?? 10;

    const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    // Create de request URLs
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newURL = new URL(this.request.url, baseURL);

    // Calculating the page numbers
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page == totalPages ? page : page + 1;
    const previousPage = page == 1 ? page : page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
