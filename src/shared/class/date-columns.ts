import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DateColumns {
    @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
    updatedAt: Date;
}
