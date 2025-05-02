const express = require('express');
require('dotenv').config();
const db = require("../db");
const bcrypt = require('bcrypt');
const lodash = require('lodash');
const app = express();

/**
 * @swagger
 * /add-vendor:
 *   post:
 *     summary: Add a new vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vendor ABC"
 *               email:
 *                 type: string
 *                 example: "vendor@example.com"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: "123, MG Road, Bangalore"
 *     responses:
 *       201:
 *         description: Vendor added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor added successfully!
 *                 results:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: integer
 *                   example: 42
 */

app.post('/add-vendor', (req, res) => {
	const vendor = req.body;
	const query = 'INSERT INTO vendors SET ?';
	db.query(query, vendor, (err, result) => {
			if (err) throw err;
			res.status(201).send({ message: 'Vendor added successfully!', results:true, id: result.insertId });
	});
});

// READ: Get all vendors
app.get('/get-vendors', (req, res) => {
    const { id } = req.headers; // Get user ID from headers
    const { page = 1, limit = 10, search = "" } = req.query; // Get pagination and search parameters from query params

    const offset = (page - 1) * limit; // Calculate offset for pagination
    const searchCondition = !lodash.isEmpty(search)
        ? `AND (vendors.vendor_name LIKE '%${search}%' OR user.name LIKE '%${search}%' OR user.email LIKE '%${search}%')`
        : ""; // Build search condition

    let query = "";
    let countQuery = "";

    if (!lodash.isEmpty(id)) {
        // Query for specific user
        query = `
            SELECT * 
            FROM vendors 
            WHERE user_id = ${id} ${searchCondition} 
            LIMIT ${limit} OFFSET ${offset};
        `;
        countQuery = `
            SELECT COUNT(*) AS total 
            FROM vendors 
            WHERE user_id = ${id} ${searchCondition};
        `;
    } else {
        // Query for all users with join
        query = `
            SELECT vendors.*, user.name AS user_name, user.mobile, user.email 
            FROM vendors 
            JOIN user ON vendors.user_id = user.user_id 
            WHERE 1=1 ${searchCondition} 
            LIMIT ${limit} OFFSET ${offset};
        `;
        countQuery = `
            SELECT COUNT(*) AS total 
            FROM vendors 
            JOIN user ON vendors.user_id = user.user_id 
            WHERE 1=1 ${searchCondition};
        `;
    }

    // First, get the total count
    db.query(countQuery, (countErr, countResults) => {
        if (countErr) {
            console.error('Error fetching count:', countErr);
            return res.status(500).json({ error: countErr.message });
        }

        const totalRecords = countResults[0]?.total || 0; // Get total records
        const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

        // Then, execute the main query
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: err.message });
            }

            // Respond with results, pagination info, and total pages
            res.json({
                results,
                success: true,
                pagination: {
                    currentPage: parseInt(page, 10),
                    limit: parseInt(limit, 10),
                    totalPages,
                },
            });
        });
    });
});


app.get('/get-feature-vendors', (req, res) => {
	const { id } = req.headers;
	let query  = 'SELECT * FROM vendors where is_featured = 1 and is_enable = 1';
	db.query(query, (err, results) => {
			if (err) throw err;
			res.send({results : results, success:true});
	});
});

// READ: Get a single vendor by ID
app.get('/get-vendor/:id', (req, res) => {
	const query = 'SELECT * FROM vendors WHERE service_reg_id = ?';
	db.query(query, [req.params.id], (err, result) => {
			if (err) throw err;
			res.send({result: result[0], results:true});
	});
});

// UPDATE: Update a vendor by ID
app.post('/update-vendor/:id', (req, res) => {
	const updates = req.body;
	const query = 'UPDATE vendors SET ? WHERE service_reg_id = ?';
	db.query(query, [updates, req.params.id], (err, result) => {
			if (err) throw err;
			res.send({ message: 'Vendor updated successfully!', results:true });
	});
});

// DELETE: Delete a vendor by ID
app.delete('/delete-vendor/:id', (req, res) => {
	const query = 'DELETE FROM vendors WHERE service_reg_id = ?';
	db.query(query, [req.params.id], (err, result) => {
			if (err) throw err;
			res.send({ message: 'Vendor deleted successfully!', results:true });
	});
});


app.get('/search-vendors', (req, res) => {
	const {
			vendor_name,
			city_name,
			region_name,
			vendor_service,
			vendor_rate,
			page = 1,
			limit = 10,
	} = req.query;

	const offset = (page - 1) * limit;

	// Build the WHERE clause dynamically
	const conditions = [];
	const params = [];

	if (vendor_name) {
			conditions.push('vendor_name LIKE ?');
			params.push(`%${vendor_name}%`);
	}
	if (city_name) {
			conditions.push('city_name LIKE ?');
			params.push(`%${city_name}%`);
	}
	if (region_name) {
			conditions.push('region_name LIKE ?');
			params.push(`%${region_name}%`);
	}
	if (vendor_service) {
			conditions.push('vendor_service LIKE ?');
			params.push(`%${vendor_service}%`);
	}
	if (vendor_rate.min) {
			conditions.push('vendor_rate >= ?');
			params.push(Number(vendor_rate.min));
	}
	if (vendor_rate.min) {
			conditions.push('vendor_rate <= ?');
			params.push(Number(vendor_rate.max));
	}
	conditions.push('is_enable = ?');
	params.push(parseInt(1));
	const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

	// Query to fetch the data
	const dataQuery = `
			SELECT * FROM vendors ${whereClause} LIMIT ? OFFSET ?
	`;
	params.push(Number(limit), Number(offset));

	// Query to fetch the total count
	const countQuery = `
			SELECT COUNT(*) AS total FROM vendors ${whereClause}
	`;

	// Execute the count query first
	db.query(countQuery, params.slice(0, -2), (err, countResult) => {
			if (err) {
					console.error('Error fetching total count:', err);
					return res.status(500).json({ message: 'Internal Server Error' });
			}

			const total = countResult[0].total;

			// Execute the data query
			db.query(dataQuery, params, (err, result) => {
					if (err) {
							console.error('Error fetching vendors:', err);
							return res.status(500).json({ message: 'Internal Server Error' });
					}

					// Send the response
					res.json({
							data: result,
							currentPage: Number(page),
							totalResults: total,
							totalPages: Math.ceil(total / limit),
							region_name: region_name,
							limit: Number(limit)
					});
			});
	});
});


module.exports = app;