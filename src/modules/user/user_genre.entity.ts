import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FictionGenre, NonFictionGenre } from "../book/book.enum";
import { User } from "../user/user.entity";

@Entity()
export class UserGenre {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: FictionGenre | NonFictionGenre;

    @ManyToOne(() =>  User, user => user.genre)
    user: User;
}