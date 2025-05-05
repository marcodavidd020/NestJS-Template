export interface IPaginationOptions {
  page?: number;
  limit?: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
