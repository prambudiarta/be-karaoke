import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('category').notNullable();
    table.string('imageUrl').notNullable();
    table.string('name').notNullable();
    table.integer('price').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('items');
}