import { BaseModel } from "src/helper/model";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Author } from "../author/author.entity";
import { Genre } from "./genre.entity";

@Entity()
export class Book extends BaseModel {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @OneToOne(() => Author)
    @JoinColumn()
    author: Author['id'];

    @Column({nullable:true})
    description: string;

    @OneToMany(() => Genre, genre => genre.id)
    @JoinColumn()
    genre: Genre[];

    @Column()
    isbn: string;

    @Column()
    purchase_url: string;
}