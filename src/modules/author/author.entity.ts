import { BaseModel } from "src/helper/model";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Genre } from "../book/genre.entity";


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

    @OneToMany(() => Genre, genre => genre.id)
    genre: Genre[];
}