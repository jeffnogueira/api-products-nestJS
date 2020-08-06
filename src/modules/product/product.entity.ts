import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DateColumns } from '../../shared/class/date-columns';
import { Category } from '../category/category.entity';

@Entity({ name: 'product' })
export class Product extends DateColumns {

    constructor(productData?) {
        super();
        this.name = productData?.name;
        this.description = productData?.description;
        this.unitPrice = productData?.unitPrice;
        this.interestPrice = productData?.interestPrice;
        this.percent = productData?.percent;
        this.quantity = productData?.quantity;
    }

    @PrimaryGeneratedColumn({ name: 'idProduct' })
    idProduct: number;

    @Column({ length: 100, type: 'varchar', name: 'name', nullable: false })
    name: string;

    @Column({ length: 500, type: 'varchar', name: 'description', nullable: false })
    description: string;

    @Column({ type: 'double', name: 'unitPrice', nullable: false })
    unitPrice: number;

    @Column({ type: 'double', name: 'interestPrice', nullable: false })
    interestPrice: number;

    @Column({ type: 'double', name: 'percent', nullable: false })
    percent: number;

    @Column({ type: 'tinyint', name: 'quantity', nullable: false })
    quantity: number;

    @ManyToOne(() => Category, category => category.products, { nullable: false })
    @JoinColumn({ name: 'idCategory' })
    category: Category;
}
