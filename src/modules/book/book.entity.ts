import { BaseModel } from "src/helper/model";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Author } from "../author/author.entity";
import { BookGenre } from "./book_genre.entity";

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
    
    @JoinColumn()
    @OneToMany(() => BookGenre, genre => genre.book)
    genre: BookGenre[];
}