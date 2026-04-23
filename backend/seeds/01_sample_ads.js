exports.seed = async function (knex) {
  await knex('users').del();

  const users = await knex('users').insert([
    {
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '11999998888',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '11988887777',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=2',
    },
    {
      name: 'Carlos Oliveira',
      email: 'carlos@example.com',
      phone: '21987776666',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Ana Costa',
      email: 'ana@example.com',
      phone: '31986665555',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=4',
    },
    {
      name: 'Pedro Ferreira',
      email: 'pedro@example.com',
      phone: '41985554444',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Lucia Martins',
      email: 'lucia@example.com',
      phone: '71984443333',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=6',
    },
    {
      name: 'Roberto Alves',
      email: 'roberto@example.com',
      phone: '81983332222',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=7',
    },
    {
      name: 'Daniela Costa',
      email: 'daniela@example.com',
      phone: '85982221111',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=8',
    },
    {
      name: 'Felipe Sousa',
      email: 'felipe@example.com',
      phone: '61981110000',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=9',
    },
    {
      name: 'Juliana Rocha',
      email: 'juliana@example.com',
      phone: '92988889999',
      password_hash: '$2a$10$ezJkm6Gp/tJ0CbZCjyM48OCKuk.axRb/SNP01aHAtnSoH6wDdbzCm',
      avatar_url: 'https://i.pravatar.cc/150?img=10',
    },
  ]);

  console.log('✅ Seeded ' + users + ' users');

  // Limpar e inserir itens de exemplo
  await knex('messages').del();
  await knex('matches').del();
  await knex('likes').del();
  await knex('items').del();

  // Buscar IDs dos usuários
  const userList = await knex('users').select('id', 'email');
  const userMap = {};
  userList.forEach(u => {
    const name = u.email.split('@')[0];
    userMap[name] = u.id;
  });

  // Inserir itens de exemplo
  const items = await knex('items').insert([
    {
      user_id: userMap.joao,
      title: 'iPhone 13 Pro',
      description: 'iPhone 13 Pro 256GB, estado impecável. Troco por notebook ou câmera profissional.',
      category: 'electronics',
      condition: 'seminovo',
    },
    {
      user_id: userMap.joao,
      title: 'Guitarra Fender Stratocaster',
      description: 'Guitarra Fender americana, som incrível. Troco por equipamento de som ou instrumentos.',
      category: 'music',
      condition: 'usado',
    },
    {
      user_id: userMap.maria,
      title: 'MacBook Pro M1',
      description: 'MacBook Pro 2021 M1 Pro, 16GB RAM, 512GB SSD. Troco por câmera profissional.',
      category: 'electronics',
      condition: 'seminovo',
    },
    {
      user_id: userMap.maria,
      title: 'Bicicleta Speed Specialized',
      description: 'Bicicleta speed Specialized Allez, tamanho 54. Troco por equipamentos de academia.',
      category: 'sports',
      condition: 'usado',
    },
    {
      user_id: userMap.pedro,
      title: 'PlayStation 5',
      description: 'PS5 com 2 controles e 5 jogos. Troco por Xbox Series X ou PC Gamer.',
      category: 'games',
      condition: 'seminovo',
    },
    {
      user_id: userMap.ana,
      title: 'Câmera Canon EOS R5',
      description: 'Câmera profissional Canon EOS R5 com lente 24-70mm. Troco por MacBook ou iPhone.',
      category: 'electronics',
      condition: 'seminovo',
    },
    {
      user_id: userMap.carlos,
      title: 'Drone DJI Mavic 3',
      description: 'Drone DJI Mavic 3 com 3 baterias. Troco por câmera ou equipamento de vídeo.',
      category: 'electronics',
      condition: 'usado',
    },
  ]);

  console.log('✅ Seeded items');

  // Buscar IDs dos itens
  const itemList = await knex('items').select('id', 'user_id', 'title');

  // Criar likes cruzados (para gerar matches)
  // João (item iPhone) curte item da Maria (MacBook)
  // Maria curte item do João (iPhone)
  // Isso cria um match!

  const joaoItem = itemList.find(i => i.user_id === userMap.joao);
  const mariaItem = itemList.find(i => i.user_id === userMap.maria);
  const pedroItem = itemList.find(i => i.user_id === userMap.pedro);
  const anaItem = itemList.find(i => i.user_id === userMap.ana);
  const carlosItem = itemList.find(i => i.user_id === userMap.carlos);

  // Likes - criando interesse mútuo
  await knex('likes').insert([
    // João -> item da Maria
    { user_id: userMap.joao, item_id: mariaItem.id },
    // Maria -> item do João (MATCH!)
    { user_id: userMap.maria, item_id: joaoItem.id },
    // Pedro -> item da Ana
    { user_id: userMap.pedro, item_id: anaItem.id },
    // Ana -> item do Pedro (MATCH!)
    { user_id: userMap.ana, item_id: pedroItem.id },
    // Carlos -> item do João
    { user_id: userMap.carlos, item_id: joaoItem.id },
  ]);

  console.log('✅ Seeded likes');

  // Criar matches (conexões entre usuários)
  await knex('matches').insert([
    {
      user_1_id: userMap.joao,
      user_2_id: userMap.maria,
      item_1_id: joaoItem.id,
      item_2_id: mariaItem.id,
      ad_shown: true,
      status: 'active',
    },
    {
      user_1_id: userMap.pedro,
      user_2_id: userMap.ana,
      item_1_id: pedroItem.id,
      item_2_id: anaItem.id,
      ad_shown: true,
      status: 'active',
    },
  ]);

  console.log('✅ Seeded matches');

  // Criar algumas mensagens de exemplo
  const matches = await knex('matches').select('id', 'user_1_id', 'user_2_id');
  const match1 = matches[0]; // João e Maria
  const match2 = matches[1]; // Pedro e Ana

  await knex('messages').insert([
    {
      match_id: match1.id,
      sender_id: userMap.joao,
      content: 'Oi Maria! Vi que você tem um MacBook Pro, ainda está disponível para troca?',
      read_at: new Date(),
    },
    {
      match_id: match1.id,
      sender_id: userMap.maria,
      content: 'Oi João! Sim, ainda tenho! Vi seu iPhone 13 Pro, parece estar em ótimo estado!',
      read_at: new Date(),
    },
    {
      match_id: match1.id,
      sender_id: userMap.joao,
      content: 'Está impecável! Podemos combinar de nos encontrar para ver os itens?',
      read_at: null,
    },
    {
      match_id: match2.id,
      sender_id: userMap.pedro,
      content: 'Oi Ana! Interessei na sua câmera Canon, meu PS5 está disponível para troca!',
      read_at: new Date(),
    },
    {
      match_id: match2.id,
      sender_id: userMap.ana,
      content: 'Olá Pedro! Que legal, sempre quis um PS5. Podemos negociar!',
      read_at: null,
    },
  ]);

  console.log('✅ Seeded messages');
  console.log('🎉 Database seeded successfully!');
};
