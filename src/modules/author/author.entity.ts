import { BaseModel } from "src/helper/model";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Book } from "../book/book.entity";
import { AuthorGenre } from "./author_genre.entity";


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

    @OneToMany(() => AuthorGenre, genre => genre.author)
    genre: AuthorGenre[];

    @OneToMany(() => Book, book => book.author)
    books: Book[];
}