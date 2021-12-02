import { randomBytes, createCipheriv, scryptSync, createDecipheriv } from 'crypto';

// const iv = randomBytes(16)

export const encryptText = (value: string, keyString: string = process.env.PASSWORD_SECRET): string => {
    const iv = Buffer.alloc(16, 0);
    const key = scryptSync(keyString, 'salt', 24) as Buffer;
    const cipher = createCipheriv('aes-192-cbc', key, iv);
    const encryptedText = Buffer.concat([cipher.update(value), cipher.final()]);
    return encryptedText.toString('hex')
}

export const decryptText = (value: string, keyString:string = process.env.PASSWORD_SECRET): string => {
    const iv = Buffer.alloc(16, 0);
    const key = scryptSync(keyString, 'salt', 24) as Buffer;
    const decipher = createDecipheriv('aes-192-cbc',key,iv);
    const decryptedText = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedText;
}