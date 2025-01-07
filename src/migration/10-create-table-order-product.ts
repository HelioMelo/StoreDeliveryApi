import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableOrderProduct1736026480360
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.order_products (
        id SERIAL PRIMARY KEY, -- 'id' will automatically get a value from the sequence
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        amount INT NOT NULL CHECK (amount > 0),
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
        FOREIGN KEY (order_id) REFERENCES public.order(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE RESTRICT ON UPDATE CASCADE
      );

      CREATE SEQUENCE public.order_products_id_seq
        AS INTEGER
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

      ALTER SEQUENCE public.order_products_id_seq OWNED BY public.order_products.id;

      ALTER TABLE ONLY public.order_products ALTER COLUMN id SET DEFAULT nextval('public.order_products_id_seq'::regclass);

      CREATE INDEX idx_order_products_order_id ON public.order_products(order_id);
      CREATE INDEX idx_order_products_product_id ON public.order_products(product_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_products_order_id;
      DROP INDEX IF EXISTS idx_order_products_product_id;
      DROP TABLE public.order_products;
      DROP SEQUENCE public.order_products_id_seq;
    `);
  }
}
