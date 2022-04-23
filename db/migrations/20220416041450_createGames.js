/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
        .createTable('games', function (table) {
            table.increments('id');
            table.integer('player_one_id').notNullable;
            table.integer('player_two_id').notNullable;
            table.string('result', 4).checkIn(['win', 'lose', 'draw']);
            table.foreign('player_one_id').references('id').inTable('users');
            table.foreign('player_two_id').references('id').inTable('users');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable("games")
};
