exports.seed = async function (knex) {
  await knex("wallets").del();

  await knex("wallets").insert([
    {
      id: 1,
      user_id: 1,
      balance: 100.0,
    },
    {
      id: 2,
      user_id: 1,
      balance: 50.0,
    },
    {
      id: 3,
      user_id: 2,
      balance: 20.0,
    },
  ]);
};
