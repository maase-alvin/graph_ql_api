import  { DataSource } from "apollo-datasource";
import sqlite3 from "sqlite3";
// const sqlite3 = require('sqlite3');

const createDatabase = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./db.sqlite', (err) => {
            if (err) {
                console.log("There was an error opening/creating the database");
                return reject(err);
                
            }
            console.log("Database opened/created successfully");
            resolve(db);
        });
    });
};

class Db extends DataSource {
    async initialize() {
        this.db = await createDatabase();
        // do not change schema initialization it is here to provide an overview of data structures
        await this.executeCommand(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY, 
        deliveryAddress TEXT NOT NULL,
        total REAL NOT NULL,
        items TEXT NOT NULL,
        discountCode TEXT,
        comment TEXT,
        status STRING NOT NULL
        );`);
        console.log("Database initialized");
    }

    close() {
        this.db.close();
    }

    executeQuery(query) {
        return new Promise((resolve, reject) => {
            this.db.all(query, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            this.db.run(command, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getOrders() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM orders", (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    getOrder(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM orders WHERE id='${id}'`, (err, rows) => {
                if (err) {
                    console.log("There was an error getting the order");
                    return reject(err);

                }
                
                const order = {
                    id: rows.id,
                    deliveryAddress: rows.deliveryAddress,
                    items: rows.items.split(',').map(item => item.trim()), // assuming items is stored as a JSON array
                    total: rows.total,
                    discountCode: rows.discountCode,
                    comment: rows.comment,
                    status: rows.status
                  };
                  resolve(order);
                  console.log("Order retrieved successfully");
            });
        });
    }

    updateOrderStatus(id, status) {
        return this.executeCommand(
            `UPDATE orders SET status='${status}' WHERE id='${id}'`
        );
    }

    insertOrder(input) {
        return new Promise((resolve, reject) => {
          this.db.run(
            `INSERT INTO orders (deliveryAddress, total, items, discountCode, comment, status) VALUES 
            ("${input.deliveryAddress}", "${input.total}", "${input.items}", "${input.discountCode}", "${input.comment}", "${input.status}")`,
            function (err) {
              if (err) {
                console.log("There was an error inserting the order");
                return reject(err);
              }
              console.log("Order inserted successfully");
              const newOrder = {
                id: this.lastID,
                deliveryAddress: input.deliveryAddress,
                items: input.items,
                total: input.total,
                discountCode: input.discountCode,
                comment: input.comment,
                status: input.status,
              };
              resolve(newOrder);
            }
          );
        });
      }
}

export const db = new Db();


// module.exports = db;