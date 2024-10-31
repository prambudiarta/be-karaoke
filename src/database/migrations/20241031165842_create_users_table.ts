import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("password").notNullable();
    table.enu("role", ["admin", "user", "staff"]).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
