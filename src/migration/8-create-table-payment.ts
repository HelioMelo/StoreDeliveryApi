import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePayment1736025609244 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`

      CREATE TABLE public.payment (
    id integer NOT NULL,
    status_id int NOT NULL,
    price numeric(10, 2) NOT NULL,
    discount numeric(10, 2) NOT NULL,
    final_price numeric(10, 2) NOT NULL,
    "type" character varying(255) NOT NULL,
    amount_payments int,
    code character varying(50),
    date_payment timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (status_id) REFERENCES public.payment_status(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE SEQUENCE public.payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;
ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT nextval('public.payment_id_seq'::regclass);

CREATE INDEX idx_payment_status_id ON public.payment(status_id);
CREATE INDEX idx_payment_code ON public.payment(code);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_payment_status_id;
      DROP INDEX IF EXISTS idx_payment_code;
      DROP TABLE public.payment;
      DROP SEQUENCE public.payment_id_seq;
    `);
  }
}
