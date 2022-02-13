import { createCipheriv, scryptSync, createDecipheriv } from 'crypto';
import { diskStorage } from 'multer';
import { extMime } from './constant';

export const encryptText = (value: string, keyString: string = process.env.APP_ID): string => {
    const iv = Buffer.alloc(16, 0);
    const key = scryptSync(keyString, 'salt', 24) as Buffer;
    const cipher = createCipheriv('aes-192-cbc', key, iv);
    const encryptedText = Buffer.concat([cipher.update(value), cipher.final()]);
    return encryptedText.toString('hex')
}

export const decryptText = (value: string, keyString: string = process.env.APP_ID): string => {
    const iv = Buffer.alloc(16, 0);
    const key = scryptSync(keyString, 'salt', 24) as Buffer;
    const decipher = createDecipheriv('aes-192-cbc', key, iv);
    const decryptedText = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedText;
}

export const getStorage = (path = "") => diskStorage({
    destination: `./uploads${path ? "/" + path : ""}`,
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}.${extMime[file.mimetype]}`)
    }
});