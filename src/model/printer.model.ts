import db from "../database/db";
import { Printer } from "../interfaces/basic";

export class PrinterModel {
  private tableName = "printers";

  public async getAll(): Promise<Printer[]> {
    return db(this.tableName).select("*");
  }

  public async getById(id: number): Promise<Printer> {
    return db(this.tableName).where({ id }).first();
  }

  public async create(printer: Printer): Promise<number[]> {
    return db(this.tableName).insert({ 'description': printer.description, 'ip': printer.ip });
  }

  public async update(id: number, printer: Printer): Promise<number> {
    return db(this.tableName).where({ id }).update(printer);
  }

  public async delete(id: number): Promise<number> {
    return db(this.tableName).where({ id }).del();
  }
}