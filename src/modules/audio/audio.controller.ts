import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { createReadStream, stat } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { AudioUploadBody } from "./audio.dto";
import { AudioService } from "./audio.service";
import { Audio } from './audio.entity';
import { ApiTags } from "@nestjs/swagger";

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
    }
})

@ApiTags('Audio')
@Controller('audio')
@UseInterceptors(ClassSerializerInterceptor)
export class AudioController {
    constructor(private audioService: AudioService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('audio', { storage }))
    @UsePipes(ValidationPipe)
    uploadAudio(@Body() uploadBody: AudioUploadBody, @UploadedFile() file: Express.Multer.File): any {
        return file.filename;
    }

    @Get('stream/:filename')
    streamAudio(@Param('filename') filename, @Res() res: Response) {
        if (!filename) throw new BadRequestException("Filename cannot be empty");
        const filePath = join(process.cwd(), 'uploads', `${filename}`);
        stat(filePath, (err, stat) => {
            if (err) {
                const be = new BadRequestException("Requested file not found");  
                return res.status(be.getStatus()).json(be.getResponse())
            } 
            const file = createReadStream(filePath);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Accept-Ranges': 'bytes',
                'Content-Length': stat.size,
            });
            file.pipe(res);
        })
    }

    @Get('download/:filename')
    downloadAudio(@Param('filename') filename): StreamableFile {
        const filePath = join(process.cwd(), 'uploads', `${filename}`);
        const file = createReadStream(filePath);
        return new StreamableFile(file);
    }
}