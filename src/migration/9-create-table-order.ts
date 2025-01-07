import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableOrder1736026461795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."order" (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        address_id INT NOT NULL,
        date TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, -- Ensure date has a default value
        payment_id INT NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
        FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (address_id) REFERENCES public.address(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON DELETE RESTRICT ON UPDATE CASCADE
      );

      CREATE SEQUENCE public."order_id_seq"
        AS INTEGER
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

      ALTER SEQUENCE public."order_id_seq" OWNED BY public."order".id;
      ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public."order_id_seq"'::regclass);

      CREATE INDEX idx_order_user_id ON public."order"(user_id);
      CREATE INDEX idx_order_address_id ON public."order"(address_id);
      CREATE INDEX idx_order_payment_id ON public."order"(payment_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_user_id;
      DROP INDEX IF EXISTS idx_order_address_id;
      DROP INDEX IF EXISTS idx_order_payment_id;
      DROP TABLE IF EXISTS public."order";
      DROP SEQUENCE IF EXISTS public."order_id_seq";
    `);
  }
}
