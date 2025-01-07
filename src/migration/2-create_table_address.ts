import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAddress1735943915835 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    CREATE TABLE public.address (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    complement VARCHAR,
    number VARCHAR NOT NULL,
    cep VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE SEQUENCE IF NOT EXISTS public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;
ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);
 `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     drop table public.user;
    `);
  }
}
