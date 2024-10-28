import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.integer('category_id').notNullable();
    table.string('imageUrl').notNullable();
    table.string('name').notNullable();
    table.integer('price').notNullable();

    table.foreign('category_id').references('id').inTable('categories');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('items');
}