import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCartProduct1736023292273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TABLE public.cart_product (
        id integer NOT NULL,
        cart_id integer NOT NULL,
        product_id integer NOT NULL,
        amount integer NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (cart_id) REFERENCES public.cart(id),
        FOREIGN KEY (product_id) REFERENCES public.product(id)
      );

      CREATE SEQUENCE public.cart_product_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

      ALTER SEQUENCE public.cart_product_id_seq OWNED BY public.cart_product.id;
      ALTER TABLE ONLY public.cart_product ALTER COLUMN id SET DEFAULT nextval('public.cart_product_id_seq'::regclass);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP SEQUENCE IF EXISTS public.cart_product_id_seq;
      DROP TABLE IF EXISTS public.cart_product;
    `);
  }
}
