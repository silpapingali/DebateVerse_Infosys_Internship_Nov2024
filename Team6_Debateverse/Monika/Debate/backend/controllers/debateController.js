const db = require('../config/db');

// Create a debate
const createDebate = async (req, res) => {
    const { question, options } = req.body;

    if (!question || typeof question !== 'string' || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: 'Invalid input. Question and at least 2 options are required.' });
    }

    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map(option => option.trim());

    if (!trimmedQuestion || trimmedOptions.some(option => !option)) {
        return res.status(400).json({ message: 'Question and options must not be empty.' });
    }

    const questionQuery = 'INSERT INTO debatequestions (question, created_at) VALUES (?, NOW())';

    db.query(questionQuery, [trimmedQuestion], (err, results) => {
        if (err) {
            console.error('Error inserting debate question:', err);
            return res.status(500).json({ message: 'Internal server error while inserting the question.' });
        }

        const questionId = results.insertId;
        const optionQuery = 'INSERT INTO debate_options (question_id, option_text, created_at) VALUES ?';
        const optionValues = trimmedOptions.map(option => [questionId, option, new Date()]);

        db.query(optionQuery, [optionValues], (err) => {
            if (err) {
                console.error('Error inserting debate options:', err);
                return res.status(500).json({ message: 'Internal server error while inserting options.' });
            }

            res.status(201).json({ message: 'Debate created successfully', questionId });
        });
    });
};

// Get debate details
const getDebateDetails = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Debate ID is required" });
    }

    const questionQuery = "SELECT * FROM debatequestions WHERE id = ?";
    db.query(questionQuery, [id], (err, questionResults) => {
        if (err) {
            console.error("Error fetching debate question:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (questionResults.length === 0) {
            return res.status(404).json({ message: "Debate not found" });
        }

        const debate = questionResults[0];
        const optionsQuery = "SELECT * FROM debate_options WHERE question_id = ?";

        db.query(optionsQuery, [id], (err, optionResults) => {
            if (err) {
                console.error("Error fetching debate options:", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            res.status(200).json({
                id: debate.id,
                text: debate.question,
                created_at: debate.created_at,
                options: optionResults.map(option => ({
                    id: option.id,
                    text: option.option_text,
                    created_at: option.created_at
                }))
            });
        });
    });
};

// Fetch all debates
const allDebates = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Pagination limit
    const offset = parseInt(req.query.offset) || 0; // Pagination offset

    const query = `
      SELECT 
          dq.id AS debate_id, 
          dq.question, 
          dq.created_at, 
          o.id AS option_id, 
          o.option_text, 
          o.created_at AS option_created_at, 
          COUNT(DISTINCT v.id) AS upvotes, 
          COUNT(DISTINCT r.id) AS likes
      FROM debatequestions dq
      LEFT JOIN debate_options o ON dq.id = o.question_id
      LEFT JOIN votes v ON o.id = v.option_id
      LEFT JOIN reactions r ON dq.id = r.debate_id AND r.action = 'like'
      GROUP BY dq.id, o.id
      ORDER BY dq.created_at DESC
      LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error('Error fetching debates:', err.message);
            return res.status(500).json({ error: 'Failed to fetch debates' });
        }

        // Format the debates with nested options
        const formattedDebates = results.reduce((acc, row) => {
            const {
                debate_id, question, created_at, 
                option_id, option_text, option_created_at, 
                upvotes, likes,
            } = row;

            let debate = acc.find(d => d.id === debate_id);
            if (!debate) {
                debate = {
                    id: debate_id,
                    text: question,
                    created_on: created_at,
                    options: [],
                    likes: likes || 0,
                };
                acc.push(debate);
            }

            if (option_id) { // Only push options if they exist
                debate.options.push({
                    id: option_id,
                    text: option_text,
                    created_at: option_created_at,
                    upvotes: upvotes || 0,
                });
            }

            return acc;
        }, []);

        res.json(formattedDebates);
    });
};

// Handle reactions (like)
const reactions = (req, res) => {
    const { debateId } = req.params;
    const { action } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    if (action !== 'like') {
        return res.status(400).json({ error: 'Invalid action.' });
    }

    const checkQuery = `SELECT id FROM reactions WHERE debate_id = ? AND user_id = ? AND action = 'like'`;
    db.query(checkQuery, [debateId, userId], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking existing reaction:', checkErr);
            return res.status(500).json({ error: 'Server error' });
        }

        if (checkResult.length > 0) {
            return res.status(409).json({ error: 'Already liked.' });
        }

        const query = `INSERT INTO reactions (debate_id, user_id, action) VALUES (?, ?, ?)`;
        db.query(query, [debateId, userId, action], (err) => {
            if (err) {
                console.error('Error inserting like:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            const likeCountQuery = `SELECT COUNT(id) AS like_count FROM reactions WHERE debate_id = ? AND action = 'like'`;
            db.query(likeCountQuery, [debateId], (countErr, countResult) => {
                if (countErr) {
                    console.error('Error fetching like count:', countErr);
                    return res.status(500).json({ error: 'Server error' });
                }

                res.json({ likeCount: countResult[0].like_count });
            });
        });
    });
};

const searchDebate = (req, res) => {
    const { keyword, page = 1, limit = 10 } = req.query;

    // Validate input
    if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({ message: 'Keyword is required for search.' });
    }

    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
        return res.status(400).json({ message: 'Keyword must not be empty.' });
    }

    const offset = (page - 1) * limit;

    const query = `
        SELECT dq.id AS debate_id, dq.question, dq.created_at,
               o.id AS option_id, o.option_text, o.created_at AS option_created_at,
               COUNT(DISTINCT v.id) AS upvotes,
               COUNT(DISTINCT r.id) AS likes
        FROM debatequestions dq
        LEFT JOIN debate_options o ON dq.id = o.question_id
        LEFT JOIN votes v ON o.id = v.option_id
        LEFT JOIN reactions r ON dq.id = r.debate_id AND r.action = 'like'
        WHERE dq.question LIKE ?
        GROUP BY dq.id, o.id
        ORDER BY dq.created_at DESC
        LIMIT ? OFFSET ?;
    `;

    const searchParam = `%${trimmedKeyword}%`;

    // Execute query
    db.query(query, [searchParam, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            console.error('Error fetching search results:', err);
            return res.status(500).json({ message: 'Server error while searching for debates.' });
        }

        // Format debates
        const formattedDebates = results.reduce((acc, row) => {
            const { debate_id, question, created_at, option_id, option_text, option_created_at, upvotes, likes } = row;

            let debate = acc.find(d => d.id === debate_id);
            if (!debate) {
                debate = {
                    id: debate_id,
                    text: question,
                    created_on: created_at,
                    options: [],
                    likes: likes || 0
                };
                acc.push(debate);
            }

            if (option_id) {
                debate.options.push({
                    id: option_id,
                    text: option_text,
                    created_at: option_created_at,
                    upvotes: upvotes || 0
                });
            }

            return acc;
        }, []);

        res.status(200).json({ debates: formattedDebates });
    });
};


const upvote = (req, res) => {
    const { debateId, optionId } = req.params;
    const userId = req.user?.id; // Assuming user is authenticated and their ID is in `req.user`

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const checkVoteQuery = `SELECT id FROM votes WHERE debate_id = ? AND option_id = ? AND user_id = ?`;
    db.query(checkVoteQuery, [debateId, optionId, userId], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking existing vote:', checkErr);
            return res.status(500).json({ error: 'Server error' });
        }

        if (checkResult.length > 0) {
            return res.status(409).json({ error: 'Already voted for this option.' });
        }

        const query = `INSERT INTO votes (debate_id, option_id, user_id) VALUES (?, ?, ?)`;
        db.query(query, [debateId, optionId, userId], (err) => {
            if (err) {
                console.error('Error inserting vote:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            // Get the current vote count for the option
            const voteCountQuery = `SELECT COUNT(id) AS vote_count FROM votes WHERE option_id = ?`;
            db.query(voteCountQuery, [optionId], (countErr, countResult) => {
                if (countErr) {
                    console.error('Error fetching vote count:', countErr);
                    return res.status(500).json({ error: 'Server error' });
                }

                res.json({ voteCount: countResult[0].vote_count });
            });
        });
    });
};
module.exports = {
    createDebate,
    getDebateDetails,
    allDebates,
    reactions,
    searchDebate ,
    upvote
};
