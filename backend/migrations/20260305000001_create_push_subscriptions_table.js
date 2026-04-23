exports.up = function(knex) {
  return knex.schema.createTable('push_subscriptions', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('endpoint', 512).notNullable();
    table.string('endpoint_hash', 64).notNullable();
    table.text('auth').nullable();
    table.text('p256dh').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'endpoint_hash']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('push_subscriptions');
};
