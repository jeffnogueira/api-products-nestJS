import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DateColumns } from '../../shared/class/date-columns';

@Entity({ name: 'user' })
export class User extends DateColumns {

    constructor(userData?) {
        super();
        this.name = userData?.name;
        this.email = userData?.email;
        this.password = userData?.password;
    }

    @PrimaryGeneratedColumn({ name: 'idUser' })
    idUser: number;

    @Column({ length: 45, type: 'varchar', name: 'name', nullable: false })
    name: string;

    @Column({ length: 100, type: 'varchar', name: 'email', nullable: false })
    email: string;

    @Column({ length: 100, type: 'varchar', name: 'password', nullable: false, select: false })
    password: string;
}
