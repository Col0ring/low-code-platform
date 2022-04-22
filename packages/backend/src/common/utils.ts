import { pseudoRandomBytes } from 'crypto'
import { DiskStorageOptions } from 'multer'

type filenameCb = DiskStorageOptions['filename']

export const getFilename: filenameCb = (req, file, cb) => {
  pseudoRandomBytes(16, (err, raw) => {
    try {
      cb(
        err,
        err
          ? undefined
          : raw.toString('hex') +
              file.originalname.substr(file.originalname.lastIndexOf('.'))
      )
    } catch (error) {
      cb(error, undefined)
    }
  })
}
