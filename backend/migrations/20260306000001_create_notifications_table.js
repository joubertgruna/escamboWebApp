/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.enum('type', ['match', 'like', 'message', 'mention']).notNullable().defaultTo('like');
    table.string('title', 200).notNullable();
    table.text('message').nullable();
    table.string('image_url', 500).nullable();
    table.integer('related_user_id').unsigned().nullable();
    table.integer('item_id').unsigned().nullable();
    table.timestamp('read_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications');
};
