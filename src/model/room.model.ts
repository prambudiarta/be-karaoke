import db from '../database/db';
import { Room } from '../interfaces/basic';

export class RoomModel {
  private tableName = 'rooms';

  public async getAll(): Promise<Room[]> {
    return db(this.tableName).select('*');
  }

  public async getById(id: number): Promise<Room> {
    return db(this.tableName).where({ id }).first();
  }

  public async create(room: Room): Promise<number[]> {
    return db(this.tableName).insert(room);
  }

  public async update(id: number, room: Room): Promise<number> {
    return db(this.tableName).where({ id }).update(room);
  }

  public async delete(id: number): Promise<number> {
    return db(this.tableName).where({ id }).del();
  }
}