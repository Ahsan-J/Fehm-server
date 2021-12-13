import { BaseModel } from "src/helper/model";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { FictionGenre, GenreType, NonFictionGenre } from "../book/book.enum";
import { Book } from "../book/book.entity";

@Entity()
export class BookGenre extends BaseModel {

    @PrimaryColumn()
    id: string;

    @Column()
    name: FictionGenre | NonFictionGenre;

    @ManyToOne(() =>  Book, book => book.genre)
    book: Book;
}