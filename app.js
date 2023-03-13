const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDbServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {});
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbServer();

const convertToCamelCase = (object) => {
  return {
    playerId: object.player_id,
    playerName: object.player_name,
    jerseyNumber: object.jersey_number,
    role: object.role,
  };
};
// API1
app.get("/players/", async (request, response) => {
  const dbQuery = "SELECT * FROM cricket_team";
  const teamData = await db.all(dbQuery);
  response.send(teamData.map((each) => convertToCamelCase(each)));
});

// API2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postQuery = `INSERT INTO cricket_team (player_name,jersey_number,role) VALUES ('${playerName}',${jerseyNumber},'${role}');`;
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
        player_id = ${playerId};`;
  const playerHistory = await db.get(playerQuery);
  response.send(convertToCamelCase(playerHistory));
});
// API4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuery = `UPDATE cricket_team SET player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}' WHERE  player_id = ${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});
// API5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
module.exports = express;
