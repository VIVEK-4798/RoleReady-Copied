const express = require('express');
require('dotenv').config();
const db = require("../db");
const app = express();

// CREATE: Add a new category
app.post('/create-categories', (req, res) => {
	const { category_name, category_color_class } = req.body;

	const query = 'INSERT INTO categories (category_name,category_color_class) VALUES (?,?)';
	db.query(query, [category_name, category_color_class], (err, result) => {
			if (err) {
					console.error('Error inserting category:', err);
					return res.status(500).json({ message: 'Error inserting category' });
			}
			res.status(201).json({ success : true, message: 'Category created successfully', category_id: result.insertId, success : true });
	});
});

// READ: Get all categories
app.get('/get-categories', (req, res) => {
	const query = 'SELECT * FROM categories';

	db.query(query, (err, results) => {
			if (err) {
					console.error('Error fetching categories:', err);
					return res.status(500).json({ message: 'Error fetching categories' });
			}
			res.status(200).json({success : true, results});
	});
});

// GET skills by category
app.get('/get-skills-by-category/:category_id', (req, res) => {
  const { category_id } = req.params;

  const query = `
    SELECT skill_id, name
    FROM skills
    WHERE category_id = ?
    ORDER BY name
  `;

  db.query(query, [category_id], (err, results) => {
    if (err) {
      console.error('Error fetching skills:', err);
      return res.status(500).json({ message: 'Error fetching skills' });
    }

    res.status(200).json({
      success: true,
      results
    });
  });
});


// READ: Get a category by ID
app.get('/get-categories/:category_id', (req, res) => {
	const { category_id } = req.params;

	const query = 'SELECT * FROM categories, WHERE category_id = ?';
	db.query(query, [category_id], (err, result) => {
			if (err) {
					console.error('Error fetching category:', err);
					return res.status(500).json({ message: 'Error fetching category' });
			}
			if (!result.length) {
					return res.status(404).json({ success : true, message: 'Category not found' });
			}
			res.status(200).json(result[0]);
	});
});

// UPDATE: Update a category by ID
app.put('/update-categories/:category_id', (req, res) => {
	const { category_id } = req.params;
	const { category_name, category_color_class } = req.body;

	const query = 'UPDATE categories SET category_name = ?, category_color_class=? WHERE category_id = ?';
	db.query(query, [category_name, category_color_class, category_id], (err, result) => {
			if (err) {
					console.error('Error updating category:', err);
					return res.status(500).json({ message: 'Error updating category' });
			}
			if (result.affectedRows === 0) {
					return res.status(404).json({ success : true, message: 'Category not found' });
			}
			res.status(200).json({ message: 'Category updated successfully', success : true });
	});
});

// DELETE: Delete a category by ID
app.delete('/delete-categories/:category_id', (req, res) => {
	const { category_id } = req.params;

	const query = 'DELETE FROM categories WHERE category_id = ?';
	db.query(query, [category_id], (err, result) => {
			if (err) {
					console.error('Error deleting category:', err);
					return res.status(500).json({ message: 'Error deleting category' });
			}
			if (result.affectedRows === 0) {
					return res.status(404).json({ message: 'Category not found' });
			}
			res.status(200).json({ success : true, message: 'Category deleted successfully', success : true });
	});
});


module.exports = app;