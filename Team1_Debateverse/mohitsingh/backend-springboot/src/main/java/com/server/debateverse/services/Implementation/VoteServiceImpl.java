package com.server.debateverse.services.Implementation;

import java.util.List;

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
    public String saveVotes(List<VoteReq> vote) {
        // return voteRepo.save(vote);
        System.out.println(vote);

        for (VoteReq v : vote) {
            User user = userRepo.findById(v.getUserId()).get();
            Option option = optionRepo.findById(v.getOptionId()).get();
            Debate debate = debateRepo.findById(v.getDebateId()).get();
            Vote newVote = new Vote();
            newVote.setUser(user);
            newVote.setDebate(debate);
            newVote.setOption(option);
            newVote.setVotes(v.getTotalVotes());
            voteRepo.save(newVote);
        }

        return "Votes saved successfully";
    }

}
