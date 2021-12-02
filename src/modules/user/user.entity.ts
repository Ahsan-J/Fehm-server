import { BaseModel } from "../../helper/common.model";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";

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

    @Column({default: 1})
    type: number;

    @Column({default: 0})
    membership_status: number;
}