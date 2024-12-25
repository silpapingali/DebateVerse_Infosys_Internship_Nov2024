import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  debates: [
    {
      id: '1',
      title: 'What programming language is better for students pursuing graduation?',
      description: 'Help students choose the best programming language to start with',
      createdBy: 'John Doe',
      createdAt: '2024-01-21T10:00:00.000Z',
      likes: 1761,
      dislikes: 234,
      options: [
        { id: '1-1', text: 'JavaScript', votes: 177, userVotes: 0 },
        { id: '1-2', text: 'Python', votes: 387, userVotes: 0 },
        { id: '1-3', text: 'Java', votes: 193, userVotes: 0 },
        { id: '1-4', text: 'C', votes: 232, userVotes: 0 },
        { id: '1-5', text: 'Others', votes: 75, userVotes: 0 }
      ]
    },
    {
      id: '2',
      title: 'Which CS career path should I choose?',
      description: 'Help decide between different career paths in computer science',
      createdBy: 'Jane Smith',
      createdAt: '2024-02-15T14:30:00.000Z',
      likes: 132,
      dislikes: 45,
      options: [
        { id: '2-1', text: 'Software Development', votes: 456, userVotes: 0 },
        { id: '2-2', text: 'Data Science', votes: 389, userVotes: 0 },
        { id: '2-3', text: 'DevOps', votes: 234, userVotes: 0 },
        { id: '2-4', text: 'Cybersecurity', votes: 345, userVotes: 0 }
      ]
    },
    {
      id: '3',
      title: 'What is your preferred development environment?',
      description: 'Share your favorite development setup',
      createdBy: 'Alex Johnson',
      createdAt: '2024-03-01T09:15:00.000Z',
      likes: 892,
      dislikes: 123,
      options: [
        { id: '3-1', text: 'VS Code', votes: 567, userVotes: 0 },
        { id: '3-2', text: 'IntelliJ IDEA', votes: 432, userVotes: 0 },
        { id: '3-3', text: 'Sublime Text', votes: 234, userVotes: 0 },
        { id: '3-4', text: 'Vim/Neovim', votes: 345, userVotes: 0 }
      ]
    }
  ],
  currentPage: 1,
  itemsPerPage: 5,
};

const debateSlice = createSlice({
  name: 'debates',
  initialState,
  reducers: {
    addDebate: (state, action) => {
      state.debates.unshift(action.payload);
    },
    upvote: (state, action) => {
      const { debateId, optionId, userId } = action.payload;
      const debate = state.debates.find(d => d.id === debateId);
      if (debate && debate.createdBy !== userId) {
        const option = debate.options.find(o => o.id === optionId);
        if (option && option.userVotes < 10) {
          option.votes += 1;
          option.userVotes += 1;
        }
      }
    },
    downvote: (state, action) => {
      const { debateId, optionId, userId } = action.payload;
      const debate = state.debates.find(d => d.id === debateId);
      if (debate && debate.createdBy !== userId) {
        const option = debate.options.find(o => o.id === optionId);
        if (option && option.votes > 0 && option.userVotes > 0) {
          option.votes -= 1;
          option.userVotes -= 1;
        }
      }
    },
    likeDebate: (state, action) => {
      const { debateId, userId } = action.payload;
      const debate = state.debates.find(d => d.id === debateId);
      if (debate && debate.createdBy !== userId) {
        debate.likes += 1;
      }
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { addDebate, upvote, downvote, likeDebate, setPage } = debateSlice.actions;
export default debateSlice.reducer;