import { NextFunction, Request, Response } from 'express';
import { AdminPermission } from 'constant';

/**
 * @description 사용자가 로그인되어 있는지 확인합니다.
 */
export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({reason: 'UNAUTHENTICATED'});
  } else {
    next();
  }
}

export function checkPermission(perm: AdminPermission = AdminPermission.AdminPage) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({reason: 'UNAUTHENTICATED'});
      return;
    }
    if (((req.user?.adminLevel ?? 0) & perm) === 0) {
      res.status(403).json({reason: 'UNAUTHORIZED'});
      return;
    }
    next();
  };
}

export function checkPermissions(...perm: AdminPermission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({reason: 'UNAUTHENTICATED'});
      return;
    }
    const filter = perm.reduce((pv, cv) => pv | cv, 0);
    if (((req.user?.adminLevel ?? 0) & filter) === 0) {
      res.status(403).json({reason: 'UNAUTHORIZED'});
      return;
    }
    next();
  };
}
