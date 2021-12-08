import { BaseModel } from "src/helper/model";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { FictionGenre, GenreType, NonFictionGenre } from "./book.enum";

@Entity()
export class Genre extends BaseModel {
    @PrimaryColumn()
    id: string;

    @Column()
    name: FictionGenre | NonFictionGenre;

    @Column()
    type: GenreType;
}