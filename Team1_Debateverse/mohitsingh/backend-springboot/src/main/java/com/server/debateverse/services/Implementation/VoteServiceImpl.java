package com.server.debateverse.services.Implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.Option;
import com.server.debateverse.entities.User;
import com.server.debateverse.entities.Vote;
import com.server.debateverse.entities.VoteReq;
import com.server.debateverse.repositories.DebateRepo;
import com.server.debateverse.repositories.OptionRepo;
import com.server.debateverse.repositories.UserRepo;
import com.server.debateverse.repositories.VoteRepo;
import com.server.debateverse.services.VoteService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService {

    private final VoteRepo voteRepo;

    private final UserRepo userRepo;

    private final OptionRepo optionRepo;

    private final DebateRepo debateRepo;

    @Override
    public String saveVotes(List<VoteReq> votes) {
        for (VoteReq v : votes) {
            User user = userRepo.findById(v.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
            Option option = optionRepo.findById(v.getOptionId())
                    .orElseThrow(() -> new RuntimeException("Option not found"));
            Debate debate = debateRepo.findById(v.getDebateId())
                    .orElseThrow(() -> new RuntimeException("Debate not found"));

            // Check if a vote already exists
            Optional<Vote> existingVote = voteRepo.findByUserAndDebateAndOption(user, debate, option);

            if (existingVote.isPresent()) {
                // Update the existing vote
                Vote voteToUpdate = existingVote.get();
                voteToUpdate.setVotes(v.getTotalVotes());
                voteRepo.save(voteToUpdate);
            } else {
                // Create a new vote
                Vote newVote = new Vote();
                newVote.setUser(user);
                newVote.setDebate(debate);
                newVote.setOption(option);
                newVote.setVotes(v.getTotalVotes());
                voteRepo.save(newVote);
            }
        }

        return "Votes saved successfully";
    }

    @Override
    public List<Vote> getVotes(Long userId, Long debateId) {
        return voteRepo.findByUserIdAndDebateId(userId, debateId);
    }

}
