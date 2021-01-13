const http = require("http");
const express = require("express");
const axios = require("axios");

// environment variables
const PORT = process.env.PORT || 3000;
const EXCHANGE_RATE_API =
  process.env.EXCHANGE_RATE_API || "https://api.exchangeratesapi.io/latest";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.route("/api/rates").get(async (req, res, next) => {
  const { base, currency: symbols } = req.query;
  const params = { base, symbols };

  // qurey external exchange rate API
  const { data } = await axios
    .get(EXCHANGE_RATE_API, { params })

    // catch error inline
    .catch((error) => {
      res.status(500).json({
        msg: "Something went wrong",
        err: error,
      });
    });

  // respond with json
  res.json({
    result: data,
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
