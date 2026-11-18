import { query } from '../config/db.js';

// @desc    Get all transactions for authenticated user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, category, search, limit } = req.query;

    let sql = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];

    if (type && type !== 'all') {
      params.push(type);
      sql += ` AND type = $${params.length}`;
    }

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND LOWER(title) LIKE $${params.length}`;
    }

    sql += ' ORDER BY date DESC, created_at DESC';

    if (limit) {
      params.push(parseInt(limit, 10));
      sql += ` LIMIT $${params.length}`;
    }

    const result = await query(sql, params);

    // Ensure amount is returned as float number
    const transactions = result.rows.map(row => ({
      ...row,
      amount: parseFloat(row.amount)
    }));

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query('SELECT * FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const transaction = {
      ...result.rows[0],
      amount: parseFloat(result.rows[0].amount)
    };

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, title, amount, category, date, notes } = req.body;

    if (!type || !title || amount === undefined || !category) {
      return res.status(400).json({ success: false, message: 'Missing required transaction fields' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be either income or expense' });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a non-negative number' });
    }

    const txDate = date || new Date().toISOString().split('T')[0];

    const result = await query(
      `INSERT INTO transactions (user_id, type, title, amount, category, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, type, title.trim(), numAmount, category, txDate, notes || null]
    );

    const created = {
      ...result.rows[0],
      amount: parseFloat(result.rows[0].amount)
    };

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { type, title, amount, category, date, notes } = req.body;

    // Check ownership
    const check = await query('SELECT id FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
    }

    const numAmount = amount !== undefined ? parseFloat(amount) : undefined;
    if (numAmount !== undefined && (isNaN(numAmount) || numAmount < 0)) {
      return res.status(400).json({ success: false, message: 'Amount must be non-negative' });
    }

    const result = await query(
      `UPDATE transactions
       SET type = COALESCE($1, type),
           title = COALESCE($2, title),
           amount = COALESCE($3, amount),
           category = COALESCE($4, category),
           date = COALESCE($5, date),
           notes = COALESCE($6, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [type, title, numAmount, category, date, notes, id, userId]
    );

    const updated = {
      ...result.rows[0],
      amount: parseFloat(result.rows[0].amount)
    };

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query('DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
    }

    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/transactions/summary
// @access  Private
export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalIncomeResult = await query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'income'",
      [userId]
    );
    const totalExpenseResult = await query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'expense'",
      [userId]
    );

    const currentMonthResult = await query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
       WHERE user_id = $1 AND type = 'expense'
         AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      [userId]
    );

    const income = parseFloat(totalIncomeResult.rows[0].total);
    const expense = parseFloat(totalExpenseResult.rows[0].total);
    const monthExp = parseFloat(currentMonthResult.rows[0].total);

    res.json({
      success: true,
      data: {
        income,
        expense,
        balance: income - expense,
        monthExp
      }
    });
  } catch (error) {
    next(error);
  }
};
