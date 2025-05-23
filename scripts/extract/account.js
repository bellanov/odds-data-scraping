/**
 * @fileoverview Extract account data.
 * @description This script queries account data from The Odds API and logs the results.
 * It retrieves account data from sports and logs the account information.
 */
import * as Sports from "../../scripts/api/sports.js";
import winston from "winston";
import fs from "fs";

// Configure Winston logger
const logger = winston.createLogger({
  level: "info", // Log level (e.g., 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: "account.log" }), // Log to a file
  ],
});

// Query Sports
await Sports.getSports()
  .then((sports) => {
    // Check your usage
    logger.info(
      `Remaining Requests : ${sports.headers["x-requests-remaining"]}`,
    );
    logger.info(`Used Requests      : ${sports.headers["x-requests-used"]}`);

    // Extract usage information
    const requests = {
      remaining: sports.headers["x-requests-remaining"],
      used: sports.headers["x-requests-used"],
    };

    // Write the account information to a JSON file
    fs.writeFileSync(
      "data/account.json",
      JSON.stringify(requests, null, 2),
      "utf-8",
    );
    logger.info("Account data successfully written to odds_account.json");
  })
  .catch((error) => {
    // Log the error
    logger.error(`Error fetching sports: ${error.message}`);
  });
