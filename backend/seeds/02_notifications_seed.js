exports.seed = async function(knex) {
  // Insert sample notifications for existing users (if users exist)
  const users = await knex('users').select('id', 'email');
  if (!users || users.length === 0) return;

  const userMap = {};
  users.forEach(u => { userMap[u.email.split('@')[0]] = u.id; });

  const notifications = [];

  if (userMap.joao) {
    notifications.push({
      user_id: userMap.joao,
      type: 'match',
      title: 'Novo match!',
      message: 'Você deu match com Maria Santos. Comece uma conversa!',
      related_user_id: userMap.maria || null,
      item_id: null,
      created_at: new Date(),
    });
  }

  if (userMap.maria) {
    notifications.push({
      user_id: userMap.maria,
      type: 'like',
      title: 'Seu item recebeu uma curtida',
      message: 'João Silva curtiu seu item MacBook Pro.',
      related_user_id: userMap.joao || null,
      item_id: null,
      created_at: new Date(),
    });
  }

  if (userMap.pedro) {
    notifications.push({
      user_id: userMap.pedro,
      type: 'message',
      title: 'Nova mensagem',
      message: 'Ana Costa enviou uma mensagem sobre seu PS5.',
      related_user_id: userMap.ana || null,
      item_id: null,
      created_at: new Date(),
    });
  }

  if (notifications.length > 0) {
    await knex('notifications').del();
    await knex('notifications').insert(notifications);
    console.log('✅ Seeded notifications');
  }
};
