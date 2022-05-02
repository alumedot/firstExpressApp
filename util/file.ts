import fs from 'fs';

export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (e) => {
    if (e) {
      throw e;
    }
  });
}
