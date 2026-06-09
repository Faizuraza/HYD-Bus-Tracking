const express = require("express");

const router = express.Router();

const Stop = require("../models/Stops");
const { z } = require("zod");
const validate = require("../utils/validate");

const stopSearchSchema = z.object({
  query: z.object({
    query: z.string().trim().min(1, "query is required"),
  }),
});

router.get("/search", validate(stopSearchSchema), async (req, res) => {

  try {

    const { query } = req.query;

    const stops = await Stop.find({

      stopName:
        new RegExp(query, "i")

    })
    .limit(10);

    res.json(stops);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

module.exports = router;