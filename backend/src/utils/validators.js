const { body, param, query } = require('express-validator');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,}$/;
const fullNameRegex = /^[a-zA-Z\s]{2,100}$/;
const customUrlRegex = /^[a-z0-9-]{3,50}$/;
const colorRegex = /^(blue|yellow|green|pink|red|purple|orange)$/;
const priorityRegex = /^(low|medium|high)$/;
const statusRegex = /^(pending|in_progress|completed)$/;
const accessTypeRegex = /^(invite|private|public)$/;
const contentRegex = /^.{1,2000}$/;

const userRegistrationValidation = [
  body('full_name').trim().notEmpty().withMessage('Full name is required')
    .matches(fullNameRegex).withMessage('Full name must be 2-100 characters, letters and spaces only'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .matches(emailRegex).withMessage('Invalid email format'),
  body('password').trim().notEmpty().withMessage('Password is required')
    .matches(passwordRegex).withMessage('Password must be at least 10 characters and contain uppercase, lowercase, number, and special character'),
];

const userUpdateValidation = [
  body('full_name').optional().trim()
    .matches(fullNameRegex).withMessage('Full name must be 2-100 characters, letters and spaces only'),
  body('email').optional().trim()
    .matches(emailRegex).withMessage('Invalid email format'),
  body('password').optional().trim()
    .matches(passwordRegex).withMessage('Password must be at least 10 characters and contain uppercase, lowercase, number, and special character'),
];

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .matches(emailRegex).withMessage('Invalid email format'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const workspaceCreationValidation = [
  body('name').trim().notEmpty().withMessage('Workspace name is required')
    .isLength({ max: 100 }).withMessage('Workspace name must be at most 100 characters'),
  body('custom_url').trim().notEmpty().withMessage('Custom URL is required')
    .matches(customUrlRegex).withMessage('Custom URL must be 3-50 characters, lowercase letters, numbers, and dashes only'),
  body('color').optional()
    .matches(colorRegex).withMessage('Color must be one of: blue, yellow, green, pink, red, purple, orange'),
  body('access_type').optional()
    .matches(accessTypeRegex).withMessage('Access type must be one of: invite, private, public'),
];

const workspaceUpdateValidation = [
  body('name').optional().trim()
    .isLength({ max: 100 }).withMessage('Workspace name must be at most 100 characters'),
  body('color').optional()
    .matches(colorRegex).withMessage('Color must be one of: blue, yellow, green, pink, red, purple, orange'),
  body('access_type').optional()
    .matches(accessTypeRegex).withMessage('Access type must be one of: invite, private, public'),
];

const taskCreationValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('description').optional().trim()
    .isLength({ max: 1000 }).withMessage('Description must be at most 1000 characters'),
  body('due_date').optional()
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  body('priority').optional()
    .matches(priorityRegex).withMessage('Priority must be one of: low, medium, high'),
  body('color').optional()
    .matches(colorRegex).withMessage('Color must be one of: blue, yellow, green, pink, red, purple, orange'),
  body('is_pinned').optional()
    .isBoolean().withMessage('is_pinned must be a boolean'),
  body('assignee_id').optional()
    .isInt().withMessage('Assignee ID must be an integer'),
];

const taskUpdateValidation = [
  body('title').optional().trim()
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('description').optional().trim()
    .isLength({ max: 1000 }).withMessage('Description must be at most 1000 characters'),
  body('due_date').optional()
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  body('priority').optional()
    .matches(priorityRegex).withMessage('Priority must be one of: low, medium, high'),
  body('status').optional()
    .matches(statusRegex).withMessage('Status must be one of: pending, in_progress, completed'),
  body('color').optional()
    .matches(colorRegex).withMessage('Color must be one of: blue, yellow, green, pink, red, purple, orange'),
  body('is_pinned').optional()
    .isBoolean().withMessage('is_pinned must be a boolean'),
  body('assignee_id').optional()
    .isInt().withMessage('Assignee ID must be an integer'),
];

const roleCreationValidation = [
  body('role_name').trim().notEmpty().withMessage('Role name is required')
    .isLength({ max: 50 }).withMessage('Role name must be at most 50 characters'),
  body('view_tasks').optional().isBoolean().withMessage('view_tasks must be a boolean'),
  body('create_tasks').optional().isBoolean().withMessage('create_tasks must be a boolean'),
  body('update_tasks').optional().isBoolean().withMessage('update_tasks must be a boolean'),
  body('delete_tasks').optional().isBoolean().withMessage('delete_tasks must be a boolean'),
  body('manage_roles').optional().isBoolean().withMessage('manage_roles must be a boolean'),
];

const roleUpdateValidation = [
  body('role_name').optional().trim()
    .isLength({ max: 50 }).withMessage('Role name must be at most 50 characters'),
  body('view_tasks').optional().isBoolean().withMessage('view_tasks must be a boolean'),
  body('create_tasks').optional().isBoolean().withMessage('create_tasks must be a boolean'),
  body('update_tasks').optional().isBoolean().withMessage('update_tasks must be a boolean'),
  body('delete_tasks').optional().isBoolean().withMessage('delete_tasks must be a boolean'),
  body('manage_roles').optional().isBoolean().withMessage('manage_roles must be a boolean'),
];

const messageCreationValidation = [
  body('content').trim().notEmpty().withMessage('Message content is required')
    .matches(contentRegex).withMessage('Message must be 1-2000 characters'),
  body('reply_to').optional().isInt().withMessage('reply_to must be an integer'),
];

const workspaceIdValidation = [
  param('workspace_id').isInt().withMessage('Workspace ID must be an integer'),
];

const taskIdValidation = [
  param('task_id').isInt().withMessage('Task ID must be an integer'),
];

const roleIdValidation = [
  param('role_id').isInt().withMessage('Role ID must be an integer'),
];

const messageIdValidation = [
  param('message_id').isInt().withMessage('Message ID must be an integer'),
];

const deadlineDaysValidation = [
  query('days').optional()
    .isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30'),
];

const validate = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      payload: null,
    });
  }
  next();
};

module.exports = {
  emailRegex, passwordRegex, fullNameRegex, customUrlRegex,
  colorRegex, priorityRegex, statusRegex, accessTypeRegex, contentRegex,
  userRegistrationValidation, userUpdateValidation, loginValidation,
  workspaceCreationValidation, workspaceUpdateValidation,
  taskCreationValidation, taskUpdateValidation,
  roleCreationValidation, roleUpdateValidation,
  messageCreationValidation,
  workspaceIdValidation, taskIdValidation, roleIdValidation, messageIdValidation,
  deadlineDaysValidation,
  validate,
};