import { BaseModel } from "src/helper/model";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Book } from "../book/book.entity";
import { Review } from "../review/review.entity";
import { User } from "../user/user.entity";

@Entity()
export class Audio extends BaseModel {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @JoinColumn()
    @ManyToOne(() => Book, book => book.audio_list)
    book: Book;

    @Column()
    url: string;

    @JoinColumn()
    @ManyToOne(() => User, user => user.audio_list)
    narrator: User;

    @OneToMany(() => Review, review => review.audio)
    comments: Review[];
}