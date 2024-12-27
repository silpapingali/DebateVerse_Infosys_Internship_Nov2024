const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Debate = require('./models/Debate'); // Ensure this path matches your project structure
const User = require('./models/User');

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/debate-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

async function createUsers() {
  const users = [
    { name: 'Alice Johnson', likes: 100, questionsCount: 3, role: 'user' },
    { name: 'Bob Smith', likes: 150, questionsCount: 2, role: 'user' },
    { name: 'Charlie Brown', likes: 75, questionsCount: 2, role: 'user' },
    { name: 'David Williams', likes: 50, questionsCount: 3, role: 'user' },
    { name: 'Emma Davis', likes: 200, questionsCount: 3, role: 'user' },
  ];

  // Add email and hash the password for each user
  for (let i = 0; i < users.length; i++) {
    users[i].email = `user${i + 1}@mail.com`;
    users[i].password = await bcrypt.hash('1234@shk', 10); // Hash the password
  }

  // Create users and save them to the database
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    console.log(`User created: ${user.name}`);
  }

  console.log('Users created successfully!');
}

async function createDebates() {
  try {
    // Fetch all users
    const users = await User.find();

    if (users.length === 0) {
      console.log('No users found in the database!');
      return;
    }

    for (const user of users) {
      const numberOfDebates = user.questionsCount; // Use the number of questions a user has asked
      const userLikes = user.likes; // Get the likes from the user

      if (numberOfDebates > 0) {
        const likesPerDebate = Math.floor(userLikes / numberOfDebates); // Divide the user's total likes equally among debates
        let remainingLikes = userLikes % numberOfDebates; // Track any remaining likes to distribute

        // Define some valid debate questions and options
        const debateQuestions = [
          {
            question: 'Should social media be regulated?',
            options: ['Yes, it should be regulated', 'No, it should remain free', 'It depends on the platform'],
          },
          {
            question: 'Is climate change the biggest threat to humanity?',
            options: ['Yes, it is the most urgent issue', 'No, there are other more pressing issues', 'It depends on the region'],
          },
          {
            question: 'Should universities be free for all?',
            options: ['Yes, education should be free', 'No, it should remain paid', 'Only for certain fields of study'],
          },
          {
            question: 'Should the voting age be lowered to 16?',
            options: ['Yes, 16-year-olds are mature enough', 'No, the voting age should remain 18', 'Only for certain elections'],
          },
          {
            question: 'Is artificial intelligence a threat to jobs?',
            options: ['Yes, AI will replace many jobs', 'No, AI will create new job opportunities', 'AI will lead to job transformation, not elimination'],
          },
        ];

        // Select only the required number of questions based on `questionsCount`
        const selectedQuestions = debateQuestions.slice(0, numberOfDebates);

        for (let i = 0; i < selectedQuestions.length; i++) {
          const { question, options } = selectedQuestions[i];

          // Assign likes, adding any remaining likes randomly to some debates
          const debateLikes = i < remainingLikes ? likesPerDebate + 1 : likesPerDebate;

          const newDebate = new Debate({
            question,
            options,
            userId: user._id,
            likes: debateLikes,
            voteCount: options.map(() => Math.floor(Math.random() * 20)), // Random vote count for each option between 0 and 20
            addedDate: new Date(
              Date.now() - Math.floor(Math.random() * 31536000000) // Random date within the last year
            ),
          });

          await newDebate.save();
          console.log(`Debate created for user ${user.name}: ${question}`);
        }
      } else {
        console.log(`User ${user.name} has no debates to create.`);
      }
    }

    console.log('Debates created successfully!');
  } catch (err) {
    console.error('Error creating debates:', err);
  } finally {
    mongoose.connection.close();
  }
}

async function main() {
  await createUsers(); // Create users first
  await createDebates(); // Then create debates for them
}

main();
