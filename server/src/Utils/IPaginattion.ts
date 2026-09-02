export interface IPagination<T> {
  page: number;
  total_pages: number;
  total_registers: number;
  results: T[];
}
