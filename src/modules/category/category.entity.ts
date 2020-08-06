import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DateColumns } from '../../shared/class/date-columns';
import { Product } from '../product/product.entity';

@Entity({ name: 'category' })
export class Category extends DateColumns {

    constructor(categoryData?) {
        super();
        this.description = categoryData?.description;
    }

    @PrimaryGeneratedColumn({ name: 'idCategory' })
    idCategory: number;

    @Column({ length: 45, type: 'varchar', name: 'description', nullable: false })
    description: string;

    @OneToMany(type => Product, product => product.category)
    products: Product[];
}
