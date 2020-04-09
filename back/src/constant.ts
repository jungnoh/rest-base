export const DOCS_PER_PAGE = 25;

export enum AdminPermission {
  AdminPage = 1 << 0,
  Board = 1 << 1,
  Superuser = 1 << 50
}