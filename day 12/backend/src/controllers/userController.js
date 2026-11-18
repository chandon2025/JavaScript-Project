import { query } from '../config/db.js';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT u.id, u.email, u.full_name, p.display_name, p.avatar_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { displayName, avatarUrl } = req.body;

    const result = await query(
      `INSERT INTO profiles (id, display_name, avatar_url, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (id)
       DO UPDATE SET
         display_name = COALESCE($2, profiles.display_name),
         avatar_url = COALESCE($3, profiles.avatar_url),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, displayName || null, avatarUrl || null]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
