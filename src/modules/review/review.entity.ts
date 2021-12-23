import { BaseModel } from "src/helper/model";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Audio } from "../audio/audio.entity";
import { User } from "../user/user.entity";

@Entity()
export class Review extends BaseModel {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    star: number;

    @Column()
    comment: string;

    @OneToOne(() => Review,{ nullable:true })
    @JoinColumn()
    parent_id: Review

    @OneToOne(() => User)
    commentor: User;

    @ManyToOne(() => Audio, audio => audio.comments)
    audio: Audio;

}