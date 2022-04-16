/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
        .createTable('turns', function (table) {
            table.increments('game_id').notNullable;
            table.increments('order').notNullable;
            table.string('position');
            table.primary(['game_id', 'order']);
            table.foreign('game_id').references('id').inTable('games');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable("turns")
};
