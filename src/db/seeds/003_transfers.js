/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  // očisti transfere
  await knex("transfers").del();

  // pretpostavka:
  // wallet 1 ima balance >= 100
  // wallet 2 postoji
  // wallet 3 postoji

  await knex("transfers").insert([
    {
      from_wallet_id: 1,
      to_wallet_id: 2,
      amount: 50,
    },
    {
      from_wallet_id: 2,
      to_wallet_id: 3,
      amount: 25,
    },
  ]);
};
