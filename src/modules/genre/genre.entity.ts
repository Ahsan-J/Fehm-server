import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FictionGenre, GenreType, NonFictionGenre } from "./genre.enum";

@Entity()
export class Genre {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: FictionGenre | NonFictionGenre;

    @Column()
    type: GenreType;
}