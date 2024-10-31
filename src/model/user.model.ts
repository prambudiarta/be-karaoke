import db from "../database/db";
import { User } from "../interfaces/basic";
import bcrypt from "bcrypt";

export class UserModel {
    private tableName = "users";

    public async getAll(): Promise<User[]> {
        return db(this.tableName).select("*");
    }

    public async getById(id: number): Promise<User> {
        return db(this.tableName).where({ id }).first();
    }

    public async create(user: User): Promise<number[]> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        return db(this.tableName).insert(user);
    }

    public async update(id: number, user: User): Promise<number> {
        if (user.password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
        return db(this.tableName).where({ id }).update(user);
    }

    public async delete(id: number): Promise<number> {
        return db(this.tableName).where({ id }).del();
    }

    public async getByUsername(username: string): Promise<User> {
        return db(this.tableName).where({ username }).first();
    }
}
