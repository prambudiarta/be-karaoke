// src/models/itemModel.ts

import knex from 'knex';
import { Item } from '../interfaces/basic';
import db from '../database/db';

export class ItemModel {
  private tableName = 'items';

  public async getAll(): Promise<Item[]> {
    return db(this.tableName).select('*');
  }

  public async getById(id: number): Promise<Item> {
    return db(this.tableName).where({ id }).first();
  }

  public async create(item: Item): Promise<number[]> {
    return db(this.tableName).insert(item);
  }

  public async update(id: number, item: Item): Promise<number> {
    return db(this.tableName).where({ id }).update(item);
  }

  public async delete(id: number): Promise<number> {
    return db(this.tableName).where({ id }).del();
  }
}