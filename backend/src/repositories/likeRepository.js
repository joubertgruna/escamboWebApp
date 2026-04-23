const db = require('../config/database');

class LikeRepository {
  async create(likeData) {
    const [id] = await db('likes').insert(likeData);
    return db('likes').where({ id }).first();
  }

  async findByUserAndItem(userId, itemId) {
    return db('likes').where({ user_id: userId, item_id: itemId }).first();
  }

  async delete(id) {
    return db('likes').where({ id }).del();
  }

  async deleteByUserAndItem(userId, itemId) {
    return db('likes').where({ user_id: userId, item_id: itemId }).del();
  }

  /**
   * Get likes received on items belonging to a user
   */
  async findReceivedByUser(userId) {
    const likes = await db('likes')
      .join('items', 'likes.item_id', '=', 'items.id')
      .join('users', 'likes.user_id', '=', 'users.id')
      .where('items.user_id', userId)
      .select(
        'likes.id',
        'likes.created_at',
        'users.id as user_id',
        'users.name',
        'users.avatar_url',
        'users.city',
        'users.state',
        'items.id as item_id',
        'items.title',
        'items.description',
      )
      .orderBy('likes.created_at', 'desc');

    // Add photos for each item
    const enriched = await Promise.all(likes.map(async (like) => {
      const photos = await db('photos')
        .where({ item_id: like.item_id })
        .select('id', 'url');
      
      return {
        id: like.id,
        created_at: like.created_at,
        user: {
          id: like.user_id,
          name: like.name,
          avatar_url: like.avatar_url,
          city: like.city,
          state: like.state,
        },
        item: {
          id: like.item_id,
          title: like.title,
          description: like.description,
          photos: photos,
        },
      };
    }));

    return enriched;
  }

  /**
   * Get items liked by a user
   */
  async findLikedByUser(userId) {
    const likes = await db('likes')
      .join('items', 'likes.item_id', '=', 'items.id')
      .join('users', 'likes.user_id', '=', 'users.id')
      .where('likes.user_id', userId)
      .select(
        'likes.id',
        'likes.created_at',
        'items.id as item_id',
        'items.title',
        'items.description',
        'items.user_id',
        'users.name as owner_name',
        'users.avatar_url as owner_avatar'
      )
      .orderBy('likes.created_at', 'desc');

    // Add photos for each item
    const enriched = await Promise.all(likes.map(async (like) => {
      const photos = await db('photos')
        .where({ item_id: like.item_id })
        .select('id', 'url');
      
      return {
        id: like.id,
        created_at: like.created_at,
        item: {
          id: like.item_id,
          title: like.title,
          description: like.description,
          owner: {
            id: like.user_id,
            name: like.owner_name,
            avatar_url: like.owner_avatar
          },
          photos: photos,
        },
      };
    }));

    return enriched;
  }

  /**
   * Check if there's a mutual like (for match detection)
   * User A liked an item of User B, and User B liked an item of User A
   */
  async findMutualLike(likerId, itemOwnerId) {
    // Find if itemOwner has liked any item of liker
    return db('likes')
      .join('items', 'likes.item_id', '=', 'items.id')
      .where('likes.user_id', itemOwnerId)
      .where('items.user_id', likerId)
      .select('likes.*', 'items.id as liked_item_id')
      .first();
  }

  /**
   * Get the item that was liked (to record in match)
   */
  async findLikedItemByUsers(likerId, itemOwnerId) {
    return db('likes')
      .join('items', 'likes.item_id', '=', 'items.id')
      .where('likes.user_id', likerId)
      .where('items.user_id', itemOwnerId)
      .select('items.id as item_id')
      .first();
  }
}

module.exports = new LikeRepository();
