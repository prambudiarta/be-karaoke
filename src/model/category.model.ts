import { Category } from '../interfaces/basic';
import db from '../database/db';

export class CategoryModel {
  private tableName = 'categories';

  public async getAll(): Promise<Category[]> {
    return db(this.tableName).select('*');
  }

  public async getById(id: number): Promise<Category> {
    return db(this.tableName).where({ id }).first();
  }

  public async create(category: Category): Promise<number[]> {
    return db(this.tableName).insert(category);
  }

  public async update(id: number, category: Category): Promise<number> {
    return db(this.tableName).where({ id }).update(category);
  }

  public async delete(id: number): Promise<number> {
    return db(this.tableName).where({ id }).del();
  }
}