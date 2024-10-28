import knex from "knex";
import knexConfig from "./knexfile";

const db = knex(knexConfig.development); // Use the development configuration

export default db;
