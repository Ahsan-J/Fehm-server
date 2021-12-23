import { BaseModel } from "src/helper/model";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Subscription extends BaseModel {
    @PrimaryColumn()
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    subscription_type: number;
}