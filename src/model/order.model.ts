import db from "../database/db";
import { Order, OrderItem } from "../interfaces/basic";

export class OrderModel {
  private orderTable = "order";
  private orderItemTable = "order_item";

  public async getAll(): Promise<Order[]> {
    return db(this.orderTable).select("*");
  }

  public async getById(id: number): Promise<Order> {
    return db(this.orderTable).where({ order_id: id }).first();
  }

  public async create(order: Order, items: OrderItem[]): Promise<number[]> {
    return db.transaction(async (trx) => {
      const [orderId] = await trx(this.orderTable).insert(order);

      const orderItems = items.map((item) => ({
        ...item,
        order_id: orderId,
      }));

      await trx(this.orderItemTable).insert(orderItems);

      return [orderId];
    });
  }

  public async getByRoomAndStatusNotCompleted(
    roomId: number
  ): Promise<Order | undefined> {
    return db(this.orderTable)
      .where({ room_id: roomId })
      .whereNot({ status: "completed" })
      .first();
  }

  public async update(
    id: number,
    order: Order,
    items: OrderItem[]
  ): Promise<number> {
    return db.transaction(async (trx) => {
      await trx(this.orderTable).where({ order_id: id }).update(order);

      await trx(this.orderItemTable).where({ order_id: id }).del();

      const orderItems = items.map((item) => ({
        ...item,
        order_id: id,
      }));

      await trx(this.orderItemTable).insert(orderItems);

      return 1;
    });
  }

  public async getItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return db(this.orderItemTable).where({ order_id: orderId });
  }

  public async delete(id: number): Promise<number> {
    return db.transaction<number>(async (trx) => {
      await trx(this.orderItemTable).where({ order_id: id }).del();
      const deletedRows = await trx(this.orderTable).where({ order_id: id }).del();
      return deletedRows;
    });
  }
}
