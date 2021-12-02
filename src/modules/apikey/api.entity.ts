import { BaseModel } from "../../helper/common.model";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class API extends BaseModel {

  @PrimaryColumn()
  key: string;

  @Column()
  name: string;
  
  @Column()
  app_id: string;

  @OneToOne(() => User)
  @JoinColumn()
  created_by: User['id'];

  @Column()
  expiry_at: string;

  @Column()
  description: string;

  @Column()
  access_level: number;
}