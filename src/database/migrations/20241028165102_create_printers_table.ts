import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('printers', (table) => {
    table.increments('id').primary();
    table.string('description').notNullable();
    table.string('ip').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('printers');
}