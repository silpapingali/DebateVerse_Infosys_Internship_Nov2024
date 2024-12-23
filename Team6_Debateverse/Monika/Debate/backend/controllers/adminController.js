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
