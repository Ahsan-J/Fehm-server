import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { FictionGenre, NonFictionGenre } from "../book/book.enum";
import { Author } from "./author.entity";

@Entity()
export class AuthorGenre {
    @PrimaryColumn()
    id: string;

    @Column()
    name: FictionGenre | NonFictionGenre;

    @ManyToOne(() =>  Author, author => author.genre)
    author: Author;
}