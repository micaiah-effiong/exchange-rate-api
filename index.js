const http = require("http");
const express = require("express");
const axios = require("axios");
const _ = require("underscore");
const PORT = process.env.PORT || 3000;
const EXCHANGE_RATE_API =
  process.env.EXCHANGE_RATE_API || "https://api.exchangeratesapi.io/latest";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.route("/api/rates").get(async (req, res, next) => {
  const { data } = await axios
    .get(EXCHANGE_RATE_API, { params: req.query })
    .catch((error) => {
      res.status(500).json({
        msg: "Something went wrong",
        err: error,
      });
    });

  const currencyArray = req.query.currency.split(",").map((e) => e.trim());
  const rates = _.pick(data.rates, currencyArray);

  res.json({
    result: {
      base: req.query.base,
      date: Date.now(),
      rates,
    },
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
