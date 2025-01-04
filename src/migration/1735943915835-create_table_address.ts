import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAddress1735943915835 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.address (
          id integer NOT NULL,
          user_id integer NOT NULL,
          complement character varying,
          number integer NOT NULL,
          cep character varying NOT NULL,
          city character varying NOT NULL,
          created_at timestamp without time zone DEFAULT now() NOT NULL,
          updated_at timestamp without time zone DEFAULT now() NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (user_id) REFERENCES public.user(id)
      );

      CREATE SEQUENCE public.address_id_seq
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
    await queryRunner.query(`DROP SEQUENCE public.address_id_seq`);
    await queryRunner.query(`DROP TABLE public.address`);
  }
}
