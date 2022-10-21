const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const app = express();
const cors = require("cors");
const sqlite = require("sqlite3").verbose();
const url = require("url");
let sql;
const db = new sqlite.Database(
  "./database.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

app.use(bodyParser.json());

//post request CARS
app.post("/database", (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    console.log(req.body);
    const { owner, brand, model, year, registration } = req.body;
    sql =
      "INSERT INTO cars(owner, brand, model, year, registration) VALUES (?,?,?,?,?)";

    db.run(sql, [owner, brand, model, year, registration], (err) => {
      // if (err) return res.json({ status: 300, success: false, error: err });
      console.log("successful input ", owner, brand, model, year, registration);
    });
    return res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

//get request CARS
app.get("/database", (req, res) => {
  sql = "SELECT * FROM cars";
  try {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.field && queryObject.type)
      sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    db.all(sql, [], (err, rows) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 300, success: false, error: "No match" });

      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

//get request SERVICE
app.get("/service", (req, res) => {
  sql = "SELECT * FROM service";
  try {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.field && queryObject.type)
      sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    db.all(sql, [], (err, rows) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 300, success: false, error: "No match" });

      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

//post request SERVICE
app.post("/service", (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    console.log(req.body);
    const { date, km, text, event, next_date, next_change, car } = req.body;
    sql =
      "INSERT INTO service(date,km,text,event,next_date,next_change,car) VALUES (?,?,?,?,?,?,?)";

    db.run(sql, [date, km, text, event, next_date, next_change, car], (err) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log(
        "successful input ",
        date,
        km,
        text,
        event,
        next_date,
        next_change,
        car
      );
    });
    return res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

//delete request;
app.delete("/database", (req, res) => {
  sql = "DELETE FROM cars";
  try {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.field && queryObject.type)
      sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    console.log(sql);
    db.run(sql, [], (err) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log("successful delete ", queryObject.field, queryObject.type);
    });
    return res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

//delete request SERVICE;
app.delete("/service", (req, res) => {
  sql = "DELETE FROM service";
  try {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.field && queryObject.type)
      sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    console.log(sql);
    db.run(sql, [], (err) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log("successful delete ", queryObject.field, queryObject.type);
    });
    return res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

//UPDATE CARS
app.put("/database/:id", (req, res) => {
  const reqId = req.params.id;
  console.log("reqId", reqId);
  sql = `UPDATE cars SET owner = ?, brand = ?, model = ?, year = ?, registration = ? WHERE car_id = ?`;
  // console.log(req.body);
  const { owner, brand, model, year, registration } = req.body;
  console.log(owner, brand, model, year, registration);
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    db.run(sql, [owner, brand, model, year, registration, reqId], (err) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log(
        "successful update ",
        owner,
        brand,
        model,
        year,
        registration
      );
      return res.json({
        status: 200,
        success: true,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

//UPDATE SERVICES
app.put("/service/:id", (req, res) => {
  const reqId = req.params.id;
  console.log("reqId", reqId);
  sql = `UPDATE service SET date = ?, km = ?, text = ?, event = ?, next_date = ?, next_change =?, car = ? WHERE service_id = ?`;
  console.log(req.body);
  const { date, km, text, event, next_date, next_change, car } = req.body;
  console.log(date, km, text, event, next_date, next_change, car);
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    db.run(
      sql,
      [date, km, text, event, next_date, next_change, car, reqId],
      (err) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log(
          "successful update ",
          date,
          km,
          text,
          event,
          next_date,
          next_change,
          car
        );
        return res.json({
          status: 200,
          success: true,
        });
      }
    );
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

app.use(cors());
app.listen(3000);
