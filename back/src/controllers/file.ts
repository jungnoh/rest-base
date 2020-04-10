import { ObjectId } from 'bson';
import multer from 'multer';
import * as FileService from 'services/core/file';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * (1<<20)
  }
});

export const uploadFile = [
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    const input = req.file.buffer;
    if (!input) {
      return res.status(400).json({reason: 'FILE_EMPTY'});
    }
    const expose = true;
    const file = await FileService.uploadLocal(input, req.user!._id, expose, req.file.originalname);
    res.json({
      success: true,
      key: file._id,
      filename: file.filename
    });
  }
];

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await FileService.get(new ObjectId(id));
    if (!result.success) {
      return res.status(404).json({reason: result.reason});
    }
    res.header({
      'Content-Type': result.result?.type,
      'Content-Disposition': `attachment; filename=${encodeURIComponent(result.result!.filename)}`
    });
    result.result!.stream.pipe(res);
  } catch (err) {
    next(err);
  }
}

