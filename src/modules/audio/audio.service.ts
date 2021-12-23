import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { BookService } from '../book/book.service';
import { UsersService } from '../user/user.service';
import { AudioBookUpload } from './audio.dto';
import { Audio } from './audio.entity';

@Injectable()
export class AudioService {
    constructor(
        @InjectRepository(Audio)
        private audioRepository: Repository<Audio>,
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
            status: 1,
        })
    }

    async getAudioDetail(id: Audio['id']) {
        if(!id) throw new BadRequestException("Invalid Audio id");

        const audio = await this.audioRepository.findOne(id, { relations:['comments'] });

        if (!audio) throw new BadRequestException("No Audio book found");

        return audio;
    }
}
