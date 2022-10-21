const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
  "./database.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);
// const sql = `CREATE TABLE cars(
//         car_id INTEGER PRIMARY KEY,
//         owner TEXT NOT NULL,
//         brand TEXT NOT NULL,
//         model TEXT NOT NULL,
//         year INTEGER NOT NULL,
//          registration TEXT UNIQUE NOT NULL)`;

const sql = `CREATE TABLE service(
          service_id INTEGER PRIMARY KEY,
          date TEXT NOT NULL,
          km TEXT NOT NULL,
          text TEXT NOT NULL,
          event INTEGER ,
          next_date TEXT,
          next_change TEXT,
          car TEXT,
          FOREIGN KEY(car) REFERENCES cars(car_id))`;
db.run(sql);
