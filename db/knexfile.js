// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const config = require("./config");

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host : config.dbHost,
      port : 5432,
      user : config.dbUser,
      password : config.dbPassword,
      database : config.dbName
    }
  },
};
