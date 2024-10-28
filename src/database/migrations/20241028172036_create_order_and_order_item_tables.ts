import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('order', (table) => {
    table.increments('order_id').primary();
    table.integer('room_id').unsigned().notNullable().references('id').inTable('rooms');
    table.integer('duration_hours').notNullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.integer('room_rate').notNullable();
    table.integer('room_total_price').notNullable();
    table.integer('grand_total_price').notNullable();
    table.enu('status', ['completed', 'ongoing']).notNullable();
  });

  await knex.schema.createTable('order_item', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable().references('order_id').inTable('order');
    table.integer('item_id').unsigned().notNullable().references('id').inTable('items');
    table.integer('quantity').notNullable();
    table.integer('price').notNullable();
    table.integer('total_price').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('order_item');
  await knex.schema.dropTable('order');
}