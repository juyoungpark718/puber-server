import bcrypt from "bcrypt-nodejs";
import { IsEmail } from "class-validator";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";
import Place from "./Place";

const BCRPYT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", nullable: true })
  @IsEmail()
  email: string | null;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  phoneNumber: string;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: "text" })
  profilePhoto: string;

  @Column({ type: "boolean", default: false })
  isDriving: boolean;

  @Column({ type: "boolean", default: false })
  isRiding: boolean;

  @Column({ type: "boolean", default: false })
  isTaken: boolean;

  @Column({ type: "double precision", default: 0 })
  lastLng: number;

  @Column({ type: "double precision", default: 0 })
  lastLat: number;

  @Column({ type: "double precision", default: 0 })
  lastOrientation: number;

  @Column({ type: "text", nullable: true })
  fbId: string;

  @OneToMany(
    type => Chat,
    chat => chat.passenger
  )
  chatsAsPassenger: Chat[];

  @OneToMany(
    type => Chat,
    chat => chat.driver
  )
  chatsAsDriver: Chat[];

  @OneToMany(
    type => Message,
    message => message.user
  )
  messages: Message[];

  @OneToMany(
    type => Ride,
    ride => ride.passenger
  )
  rideAsPassenger: Ride[];

  @OneToMany(
    type => Ride,
    ride => ride.driver
  )
  rideAsDriver: Ride[];

  @OneToMany(
    type => Place,
    place => place.user
  )
  places: Place[] | any;

  @CreateDateColumn()
  createAt: string;
  @UpdateDateColumn() updatedAt: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public async comparePassword(password: string): Promise<boolean> {
    const hashString = await this.hashPassword(password);
    return new Promise(function(resolve, reject) {
      const result = bcrypt.compareSync(password, hashString);
      resolve(result);
    });
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashPassword = await this.hashPassword(this.password);
      this.password = hashPassword;
    }
  }

  private hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(BCRPYT_ROUNDS);
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, salt);
      if (hashedPassword) {
        resolve(hashedPassword);
      }
      reject(new Error("Hashed Failed"));
    });
  }
}

export default User;
