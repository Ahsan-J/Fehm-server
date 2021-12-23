import { BaseModel } from "src/helper/model";
import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Notification extends BaseModel {
    @PrimaryColumn()
    id: string;
}