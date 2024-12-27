const db = require('../config/db');

const allDebates = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; 
    const offset = parseInt(req.query.offset) || 0; 

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

            if (option_id) { 
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
const searchDebate = (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
    }

    const query = `
        SELECT dq.id AS debate_id, dq.question, dq.created_at, 
               o.id AS option_id, o.option_text, o.created_at AS option_created_at, 
               COUNT(DISTINCT v.id) AS upvotes, COUNT(DISTINCT r.id) AS likes
        FROM debatequestions dq
        LEFT JOIN debate_options o ON dq.id = o.question_id
        LEFT JOIN votes v ON o.id = v.option_id
        LEFT JOIN reactions r ON dq.id = r.debate_id AND r.action = 'like'
        WHERE dq.question LIKE ?
        GROUP BY dq.id, o.id
        ORDER BY dq.created_at DESC
    `;

    db.query(query, [`%${keyword}%`], (err, results) => {
        if (err) {
            console.error('Error searching debates:', err.message);
            return res.status(500).json({ error: 'Failed to search debates' });
        }

        const formattedDebates = results.reduce((acc, row) => {
            const { debate_id, question, created_at, option_id, option_text, option_created_at, upvotes, likes } = row;

            let debate = acc.find(d => d.id === debate_id);
            if (!debate) {
                debate = {
                    id: debate_id,
                    text: question,
                    created_on: created_at,
                    options: [],
                    total_likes: likes || 0,
                };
                acc.push(debate);
            }

            if (option_id) {
                debate.options.push({
                    id: option_id,
                    text: option_text,
                    created_at: option_created_at,
                    upvotes: upvotes || 0,
                });
            }

            return acc;
        }, []);

        res.json({ success: true, debates: formattedDebates });
    });
};
const recentDebates = async (req, res) => {
    const limit = 3; 

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
      LIMIT ?
    `;

    db.query(query, [limit], (err, results) => {
        if (err) {
            console.error('Error fetching recent debates:', err.message);
            return res.status(500).json({ error: 'Failed to fetch recent debates' });
        }

        
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

            if (option_id) { 
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

// Route to search user
const searchUser = async (req, res) => {
    const { query } = req.query; 
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
  
    
    const sql = `
      SELECT 
        u.id, 
        u.username, 
        u.created_at,
        COUNT(DISTINCT dq.id) AS total_debates,
        SUM(CASE WHEN r.action = 'like' THEN 1 ELSE 0 END) AS total_likes,
        COUNT(v.id) AS total_votes
      FROM 
        users u
      LEFT JOIN 
        debatequestions dq ON dq.id = u.id
      LEFT JOIN 
        reactions r ON dq.id = r.debate_id
      LEFT JOIN 
        votes v ON dq.id = v.option_id
      WHERE 
        u.username LIKE ? OR u.id = ?
      GROUP BY 
        u.id;
    `;
  
    
    db.query(sql, [`%${query}%`, query], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Server Error' });
      }
  
      if (result.length > 0) {
        res.json({ user: result[0], message: 'User found' });
      } else {
        res.status(404).json({ message: 'No user found' });
      }
    });
  };
  
  
  
  const suspendUser = async (req, res) => {
    let { userId } = req.query; 
  
    console.log('Raw query parameters:', req.query); 
    console.log('Raw userId value:', userId); 
  
   
    userId = parseInt(userId?.replace(/[^0-9]/g, ''), 10); 
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Valid User ID is required.' });
    }
  
    console.log('Validated User ID:', userId); 
  
    const sql = 'UPDATE users SET status = "suspended" WHERE id = ?';
  
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error updating user status:', err);
        return res.status(500).json({ message: 'Error suspending user' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No user found with the given ID' });
      }
  
      console.log('User suspended successfully:', result);
      res.json({ message: 'User suspended successfully' });
    });
  };
  
  // Route to delete a user
   const deleteUser = async (req, res) => {
    let { userId } = req.query; 
  
    console.log('Raw query parameters:', req.query); 
    console.log('Raw userId value:', userId); 
    
    userId = parseInt(userId?.replace(/[^0-9]/g, ''), 10); 
  
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Valid User ID is required.' });
    }
  
    console.log('Validated User ID:', userId); 
  
    const sql = 'DELETE FROM users WHERE id = ?';
  
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Error deleting user' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No user found with the given ID' });
      }
  
      console.log('User deleted successfully:', result);
      res.json({ message: 'User deleted successfully' });
    });
  };
  
  
  const UserDetail =async (req, res) => {
    const { userId } = req.query;
  
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query parameters.' });
    }
  
    
    const query = `
      SELECT 
        u.id, 
        u.username, 
        u.created_at,
        COUNT(DISTINCT dq.id) AS total_debates,
        SUM(CASE WHEN r.action = 'like' THEN 1 ELSE 0 END) AS total_likes,
        COUNT(v.id) AS total_votes
      FROM 
        users u
      LEFT JOIN 
        debate_questions dq ON dq.creator_id = u.id
      LEFT JOIN 
        reactions r ON dq.id = r.debate_id
      LEFT JOIN 
        votes v ON dq.id = v.option_id
      WHERE 
        u.id = ?
      GROUP BY 
        u.id;
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to fetch user details.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      const user = results[0]; 
      res.json({ user });
    });
};
  
  

module.exports = {
    
    allDebates,
    searchDebate ,
    recentDebates,
    searchUser,
    UserDetail,suspendUser,
    deleteUser

    
};