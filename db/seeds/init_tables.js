/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {login: 'Washington', name: 'George'},
    {login: 'Adams', name: 'John'},
    {login: 'Jefferson', name: 'Thomas'},
    {login: 'Madison', name: 'James'},
    {login: 'Monroe', name: 'James'}
  ]);
  
  await knex('games').del()
  await knex('games').insert([
    {player_one_id: 1, player_two_id: 2, result: 'win'},
    {player_one_id: 3, player_two_id: 4, result: 'win'},
    {player_one_id: 5, player_two_id: 1, result: 'draw'},
    {player_one_id: 4, player_two_id: 2, result: 'lose'},
    {player_one_id: 1, player_two_id: 3, result: 'lose'},
  ]);
};
