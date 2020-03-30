export type ServiceResult<T = undefined, R = undefined> = Promise<{
  success: boolean;
  reason?: T;
  result?: R;
}>;
