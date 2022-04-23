const config = require("./config");

const knex = require('knex')({
    client: 'postgresql',
    connection: {
      host : config.dbHost,
      port : 5432,
      user : config.dbUser,
      password : config.dbPassword,
      database : config.dbName
    }
  });

const statistics = knex.select(
    {
        user: 'users.login',
        won: knex.sum(knex.raw("CASE WHEN tmp.result = 'win' THEN 1 ELSE 0 END")),
        drawn: knex.sum(knex.raw("CASE WHEN tmp.result = 'draw' THEN 1 ELSE 0 END")),
        lost: knex.sum(knex.raw("CASE WHEN tmp.result = 'lose' THEN 1 ELSE 0 END"))
    })
.from(
    {
    tmp: knex('games').select({
        id: 'id',
        player: 'player_one_id',
        result: 'result'
    }).union(knex('games').select({
        id: 'id',
        player: 'player_two_id',
        result: knex.raw("CASE WHEN result = 'win' THEN 'lose' WHEN result = 'lose' THEN 'win' ELSE 'draw' END")
    }))
})
.leftJoin('users', 'tmp.player', 'users.id')
.groupBy('users.login');

statistics.then( (res) => {
    console.log(res);
    process.exit();
});