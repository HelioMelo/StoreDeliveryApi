import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1735942426942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.user (
          id integer NOT NULL,
          name character varying NOT NULL,
          email character varying NOT NULL UNIQUE,
          cpf character varying NOT NULL,
          type_user int NOT NULL,
          phone character varying NOT NULL,
          password character varying NOT NULL,
          created_at timestamp without time zone DEFAULT now() NOT NULL,
          updated_at timestamp without time zone DEFAULT now() NOT NULL,
          primary key (id)
      );

      CREATE SEQUENCE IF NOT EXISTS public.user_id_seq
          AS integer
          START WITH 1
          INCREMENT BY 1
          NO MINVALUE
          NO MAXVALUE
          CACHE 1;

      ALTER SEQUENCE public.user_id_seq OWNED BY public.user.id;

      ALTER TABLE ONLY public.user ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SEQUENCE IF EXISTS public.user_id_seq`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.user`);
  }
}
