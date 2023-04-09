import { Migration } from '@mikro-orm/migrations';

export class Migration20230409100955 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "anchor" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz(0) not null, "x" float not null, "y" float not null, "z" float not null, constraint "anchor_pkey" primary key ("id"));');

    this.addSql('create table "gateway" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz(0) not null, constraint "gateway_pkey" primary key ("id"));');

    this.addSql('create table "tag" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz(0) not null, constraint "tag_pkey" primary key ("id"));');

    this.addSql('create table "tag-position" ("id" serial primary key, "tag_id" varchar(255) not null, "x" float not null, "y" float not null, "z" float not null, "created_at" timestamptz(0) not null);');

    this.addSql('alter table "tag-position" add constraint "tag-position_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tag-position" drop constraint "tag-position_tag_id_foreign";');

    this.addSql('drop table if exists "anchor" cascade;');

    this.addSql('drop table if exists "gateway" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "tag-position" cascade;');
  }

}
