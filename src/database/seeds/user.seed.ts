import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      username: 'admin',
      password: await bcrypt.hash('adminpassword', 10),
      role: 'admin',
    },
    {
      username: 'user1',
      password: await bcrypt.hash('user1password', 10),
      role: 'user',
    },
    {
      username: 'staff1',
      password: await bcrypt.hash('staff1password', 10),
      role: 'staff',
    },
  ]);
}