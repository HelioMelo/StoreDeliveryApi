import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableStatus1736025476067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.payment_status (
            id integer NOT NULL,
            name character varying(255) NOT NULL,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            PRIMARY KEY (id),
            UNIQUE (name)
        );

        CREATE SEQUENCE public.payment_status_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;

        ALTER SEQUENCE public.payment_status_id_seq OWNED BY public.payment_status.id;
        ALTER TABLE ONLY public.payment_status ALTER COLUMN id SET DEFAULT nextval('public.payment_status_id_seq'::regclass);

        CREATE INDEX idx_payment_status_name ON public.payment_status(name);
 `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP INDEX IF EXISTS idx_payment_status_name;
            DROP TABLE public.payment_status;
            DROP SEQUENCE public.payment_status_id_seq;
        `);
  }
}
