import { BaseModel } from "src/helper/model";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Audio } from "../audio/audio.entity";
import { Author } from "../author/author.entity";
import { Genre } from "../genre/genre.entity";

@Entity()
export class Book extends BaseModel {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @JoinColumn()
    @ManyToOne(() => Author, author => author.books)
    author: Author;

    @Column({nullable:true})
    description: string;

    @Column()
    isbn: string;
    
    @Column()
    purchase_url: string;
    
    @ManyToMany(() => Genre)
    @JoinTable()
    genre: Genre[];

    @OneToMany(() => Audio, audio => audio.book)
    audio_list: Audio[];
}