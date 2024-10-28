import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('rooms', (table) => {
    table.increments('id').primary();
    table.string('description').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.boolean('isAvailable').notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('rooms');
}