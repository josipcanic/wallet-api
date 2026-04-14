/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transfers", (table) => {
    table.increments("id").primary();

    table
      .integer("from_wallet_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("RESTRICT");

    table
      .integer("to_wallet_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("RESTRICT");

    table.decimal("amount", 14, 2).notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());

    //sprijecavanje prijenos na isti novcanik
    table.check("from_wallet_id <> to_wallet_id");

    table.index("from_wallet_id");
    table.index("to_wallet_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transfers");
};
