import { ObjectId } from 'bson';
import { fromBuffer as extFromBuffer } from 'file-type';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import FileModel, { FileDoc } from 'models/file';
import {v1 as uuidV1} from 'uuid';
import { ServiceResult } from 'util/types';

const UPLOAD_DIR = __dirname + '../../../../../upload';
function localFilePath(key: string) {
  return path.join(UPLOAD_DIR, key);
}

export async function uploadLocal(buf: Buffer, owner: ObjectId, expose = false, filename?: string): Promise<FileDoc> {
  const key = uuidV1();
  const filePath = localFilePath(key);
  const fileType = (await extFromBuffer(buf))?.mime ?? 'application/octet-stream';
  const fileObj = await FileModel.create({
    medium: 'local',
    expose,
    owner,
    filename,
    key,
    type: fileType
  });
  if (fileType.startsWith('image')) {
    await sharp(buf)
      .resize(2400, 2400, {fit: sharp.fit.inside})
      .toFile(filePath);
  } else {
    await fs.writeFile(filePath, buf);
  }
  return fileObj;
}

export async function get(id: ObjectId):
ServiceResult<'FILE_NEXIST', {expose: boolean; filename: string; type: string; stream: fs.ReadStream}> {
  const fileObj = await FileModel.findById(id);
  if (!fileObj) {
    return {reason: 'FILE_NEXIST', success: false};
  }
  return {
    result: {
      expose: fileObj.expose,
      stream: fs.createReadStream(localFilePath(fileObj.key)),
      filename: fileObj.filename ?? fileObj._id,
      type: fileObj.type
    },
    success: true
  };
}