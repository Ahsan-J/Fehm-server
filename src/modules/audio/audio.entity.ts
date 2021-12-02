import { BaseModel } from "src/helper/common.model";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Audio extends BaseModel {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @OneToOne(() => User)
    @JoinColumn()
    author: User['id'];

    @OneToOne(() => User)
    @JoinColumn()
    narrator: User['id'];

    @Column({nullable:true})
    description: string;
}