const db = require('../config/database');

const checkPermission = (action) => async (req, res, next) => {
  const workspace_id = req.params.workspace_id || req.body.workspace_id;
  const { user_id } = req.user;

  try {
    const result = await db.query(
      `SELECT r.${action} FROM workspace_members wm
       JOIN roles r ON wm.role_id = r.role_id
       WHERE wm.user_id = $1 AND wm.workspace_id = $2`,
      [user_id, workspace_id]
    );

    if (!result.rows[0]?.[action]) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        payload: null,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkPermission };