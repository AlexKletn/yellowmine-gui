export class RequestFilterMaker<FILTER = Record<string, unknown>> {
  offset?: number;
  limit?: number;

  filters: FILTER = {} as FILTER;

  constructor(offset?: number, limit?: number) {
    this.offset = offset;
    this.limit = limit;
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
    const result: Record<string, string | number> = {};

    if (this.offset) {
      result['offset'] = this.offset;
    }
    if (this.limit) {
      result['limit'] = this.limit;
    }
    if (this.filters) {
      Object.assign(result, this.filters);
    }

    return result;
  }
}
