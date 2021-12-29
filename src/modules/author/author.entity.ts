import { BaseModel } from "src/helper/model";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Book } from "../book/book.entity";
import { Genre } from "../genre/genre.entity";

@Entity()
export class Author extends BaseModel {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    bio: string;

    @Column()
    url: string;

    @ManyToMany(() => Genre)
    @JoinTable()
    genre: Genre[];

    @OneToMany(() => Book, book => book.author)
    @JoinColumn()
    books: Book[];
}