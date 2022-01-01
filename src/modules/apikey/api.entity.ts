import { BaseModel } from "../../helper/model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class API extends BaseModel {

  @PrimaryColumn()
  key: string;

  @Column()
  name: string;
  
  @Column()
  app_id: string;

  @JoinColumn()
  @ManyToOne(() => User, user => user.api)
  created_by: User;

  @Column()
  expiry_at: string;

  @Column()
  description: string;

  @Column()
  access_level: number;
}