import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { CommonService } from 'src/helper-modules/common/common.service';
import { FindOneOptions, Repository } from 'typeorm';
import { BookService } from '../book/book.service';
import { UsersService } from '../user/user.service';
import { AudioBookUpload } from './audio.dto';
import { Audio } from './audio.entity';
import { AudioStatus } from './audio.enum';

@Injectable()
export class AudioService {
    constructor(
        @InjectRepository(Audio)
        private audioRepository: Repository<Audio>,
        @Inject(CommonService)
        private commonService: CommonService,
        private bookService: BookService,
        private userService: UsersService,
    ) {}

    async createBookAudio(body:AudioBookUpload, audioFile: Express.Multer.File) : Promise<Audio> {

        const book = await this.bookService.getBookById(body.book_id);

        const narrator = await this.userService.getUser(body.narrator_id);

        return this.audioRepository.save({
            book,
            id: nanoid(),
            name: audioFile.originalname,
            narrator,
            url: `/audio/stream/${audioFile.filename}`,
            description: body.description,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
            deleted_at: null,
            status: AudioStatus.InActive,
        })
    }

    async getAudioDetail(id: Audio['id'], options?: FindOneOptions<Audio>) {
        if(!id) throw new BadRequestException("Invalid Audio id");
        const audio = await this.audioRepository.findOne(Object.assign(options, {where:{id}}));
        if (!audio) throw new BadRequestException("No Audio book found");
        return audio;
    }

    async changeAudioStatus(id: Audio['id'], status: AudioStatus, remark: Audio['remark'] = null): Promise<Audio> {
        const audio = await this.getAudioDetail(id);
        audio.status = this.commonService.setValue(audio.status, status);
        audio.remark = remark;
        return await this.audioRepository.save(audio);
    }
}
