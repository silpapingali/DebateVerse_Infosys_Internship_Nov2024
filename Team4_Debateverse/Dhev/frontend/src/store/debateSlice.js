import { createSlice } from '@reduxjs/toolkit';

const debateSlice = createSlice({
  name: 'debates',
  initialState: {
    debates: [],
  },
  reducers: {
    fetchDebateSuccess: (state, action) => {
      const index = state.debates.findIndex(d => d.id === action.payload.id);
      if (index === -1) {
        state.debates.push(action.payload);
      } else {
        state.debates[index] = action.payload;
      }
    },
    upvote: (state, action) => {
      const { debateId, optionId } = action.payload;
      const debate = state.debates.find(d => d.id === debateId);
      const option = debate.options.find(opt => opt.id === optionId);
      option.votes += 1;
    },
    downvote: (state, action) => {
      const { debateId, optionId } = action.payload;
      const debate = state.debates.find(d => d.id === debateId);
      const option = debate.options.find(opt => opt.id === optionId);
      option.votes -= 1;
    },
    likeDebate: (state, action) => {
      const { debateId, userId } = action.payload;
      const debate = state.debates.find(d => d.id === debateId);
      debate.likes += 1;
      debate.likedBy.push(userId);
    },
  },
});

export const { fetchDebateSuccess, upvote, downvote, likeDebate } = debateSlice.actions;
export default debateSlice.reducer;
