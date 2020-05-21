export class Pagination<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[] = [];
}
