import { NextFunction, Request, Response } from "express";

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

/**
 * @description 사용자가 슈퍼유저 (최고관리자)인지 확인합니다.
 */
export function checkSuperuser(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({reason: 'UNAUTHENTICATED'});
    return;
  }
  if ((req.user?.adminLevel ?? 0) < 2) {
    res.status(403).json({reason: 'UNAUTHORIZED'});
    return;
  }
  next();
}
