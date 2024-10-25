import { Subject } from 'rxjs';

export class RequestFilter<FILTER = Record<string, unknown>> extends Subject<FILTER> {
  offset?: number;
  limit?: number;

  filters: FILTER = {} as FILTER;

  constructor(offset?: number, limit?: number) {
    super();

    this.offset = offset;
    this.limit = limit;

    this.make();
  }

  setOffsetPagination(offset: number, limit: number): void {
    this.offset = offset;
    this.limit = limit;
  }

  setPagePagination(page: number, pageSize: number) {
    this.offset = (page - 1) * pageSize;
    this.limit = pageSize;

    return this;
  }

  increment(count: number) {
    this.offset = (this.offset ?? 0) + (this.limit ?? 0);
    this.limit = count;

    this.make();

    return this;
  }

  setFilters(filters: FILTER) {
    this.filters = filters;

    return this;
  }

  setFilter(key: keyof FILTER, value: unknown) {
    if (!this.filters) {
      this.filters = {} as FILTER;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.filters[key] = value;

    return this;
  }

  removeFilter(key: keyof FILTER) {
    if (this.filters[key]) {
      delete this.filters[key];
    }
  }

  make() {
    const result: Record<string, string | number | Array<string | number>> = {};

    if (this.offset) {
      result['offset'] = this.offset;
    }
    if (this.limit) {
      result['limit'] = this.limit;
    }
    if (this.filters) {
      Object.assign(result, this.filters);
    }

    this.next(result as FILTER);

    return result;
  }
}
