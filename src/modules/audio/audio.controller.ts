import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { createReadStream, stat } from 'fs';
import { CreateReadStreamOptions } from 'fs/promises';
import { extname, join } from 'path';
import { Response, Request } from "express";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudioApprove, AudioBlock, AudioBookUpload } from './audio.dto';
import { AudioService } from './audio.service';
import { Audio } from './audio.entity';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UseAccess, UseRoles } from '../auth/auth.guard';
import { APIAccessLevel } from '../apikey/api.enum';
import { AudioStatus } from './audio.enum';
import { UserRole } from '../user/user.enum';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
    }
});

@ApiTags('Audio')
@ApiBearerAuth('AccessToken')
@ApiSecurity("ApiKeyAuth")
@Controller('audio')
@UseAccess(APIAccessLevel.Standard)
@UseRoles(UserRole.User)
@UseGuards(AuthGuard)
export class AudioController {

    constructor(private audioService: AudioService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('book', { storage }))
    @UseRoles(UserRole.Narrator, UserRole.Admin, UserRole.SuperAdmin)
    uploadBook(@Body() audioUpload: AudioBookUpload, @UploadedFile() file: Express.Multer.File): Promise<Audio> {
        return this.audioService.createBookAudio(audioUpload, file);
    }

    @Post('approve')
    @UseRoles(UserRole.Admin)
    approvedUploadedAudio(@Body() body: AudioApprove): Promise<Audio> {
        return this.audioService.changeAudioStatus(body.audio_id, AudioStatus.Active);
    }

    @Post('block')
    @UseRoles(UserRole.Admin)
    blockUploadedAudio(@Body() body: AudioBlock): Promise<Audio> {
        return this.audioService.changeAudioStatus(body.audio_id, AudioStatus.Blocked, body.remark);
    }

    @Get('stream/:filename')
    streamBook(@Param('filename') filename, @Res() res: Response, @Headers() headers: Request['headers']) {
        if (!filename) throw new BadRequestException("Filename cannot be empty");
        const filePath = join(process.cwd(), 'uploads', `${filename}`);
        stat(filePath, (err, stat) => {
            if (err) {
                const be = new BadRequestException("Requested file not found");
                return res.status(be.getStatus()).json(be.getResponse())
            }

            let code = 200;

            const opts: CreateReadStreamOptions = {
                start: 0,
                end: stat.size
            };

            const sendingHeaders = {
                'Content-Type': 'audio/mpeg',
                'Accept-Ranges': 'bytes',
                'Content-Length': stat.size,
                "Last-Modified": stat.mtime.toUTCString()
            }

            if (headers.range) {
                code = 206;
                
                const [, , startingRange, endingRange] = /(\w*)=(\d*)-(\d*)/.exec(headers.range);
                opts.end = parseInt(endingRange, 10) || (stat.size - 1);
                opts.start = parseInt(startingRange, 10) || 0;

                sendingHeaders["Content-Range"] = `bytes ${opts.start}-${opts.end}/${stat.size}`;
                sendingHeaders["Content-Length"] = opts.end - opts.start + 1;

                if (opts.start >= stat.size || opts.end >= stat.size) { 
                    //exceeding range limit and end on proper status code
                    res.setHeader("Content-Range", `bytes */${stat.size}`);
                    return res.status(416).end();
                }
            }

            const file = createReadStream(filePath, opts);
            res.status(code).set(sendingHeaders);
            file.pipe(res);
        })
    }
}
