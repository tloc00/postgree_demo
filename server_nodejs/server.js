const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const pg = require("pg");
const e = require("express");
const app = express();
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "countries",
  password: "123456",
  port: 5432,
  max: 10,
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/country", (req, res) => {
  pool.connect((err, db, done) => {
    if (err) res.status(400).send(err);
    else {
      db.query("select* from country", (err, table) => {
        done();
        if (err) res.status(400).send(err);
        else res.status(200).send(table.rows);
        console.log("res", table.rows);
      });
    }
  });
});

app.delete("/country/:id", (req, res) => {
  pool.connect((err, db, done) => {
    if (err) res.status(400).send(err);
    else {
      db.query(
        "delete from country where id=$1",
        [req.params.id],
        (err, table) => {
          done();
          if (err) res.status(400).send(err);
          else res.status(200).send({ message: "Delete successed" });
        }
      );
    }
  });
});

app.post("/country", (req, res) => {
  const { id, country_name, continent_name } = req.body;
  console.log(req.body);
  pool.connect((err, db, done) => {
    if (err) res.status(400).send(err);
    else {
      db.query(
        "insert into country (id, country_name, continent_name) values ($1, $2, $3)",
        [id, country_name, continent_name],
        (err, table) => {
          if (err) res.status(400).send(err);
          else res.status(201).send({ message: "Add country successed" });
          console.log(table.rows);
        }
      );
    }
  });
});

app.listen(3000, () => console.log("Start on port 3000"));
