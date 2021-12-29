import { BaseModel } from "../../helper/model";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { MemberShip, UserRole } from "./user.enum";
import { Genre } from "../genre/genre.entity";
import { Audio } from "../audio/audio.entity";

@Entity()
export class User extends BaseModel {
    
    @PrimaryColumn()
    id: string;

    @Column()
    first_name: string;
    
    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    contact_number: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({default: UserRole.User})
    role: UserRole;

    @Column({default: MemberShip.InActive})
    membership_status: MemberShip;

    @ManyToMany(() => Genre)
    @JoinTable()
    genre: Genre[];

    @OneToMany(() => Audio, audio => audio.narrator)
    @JoinColumn()
    audio_list: Audio[];
}