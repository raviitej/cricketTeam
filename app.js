const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, " cricketTeam.db ");
const initializeDbServer = async () => {
  try {
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbServer();
// API1
app.get("/players/", async (request, response) => {
  const dbQuery = "SELECT * FROM cricket_team";
  const teamData = await db.all(dbQuery);
  response.send(teamData);
});
// API2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postQuery = `INSERT INTO cricket_team (playerName,jerseyNumber,role) VALUES ('${playerName}',${jerseyNumber},'${role}');`;
  const postResponse = await db.run(postQuery);
  const playerId = postResponse.lastID;
  response.send("Player Added to Team");
});
// API3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerQuery = `SELECT
        *
        FROM
        cricket_team
        WHERE
        playerId = ${playerId};`;
  const playerHistory = await db.get(playerQuery);
  response.send(playerHistory);
});
// API4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuery = `UPDATE cricket_team SET '${playerName}',${jerseyNumber},'${role}' WHERE  playerId = ${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});
// API5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM
      cricket_team
    WHERE
      playerId = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
