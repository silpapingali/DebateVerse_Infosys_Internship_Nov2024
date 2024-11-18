package com.server.debateverse.services.Implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.server.debateverse.entities.Debate;
import com.server.debateverse.entities.Option;
import com.server.debateverse.repositories.DebateRepo;
import com.server.debateverse.repositories.OptionRepo;
import com.server.debateverse.services.OptionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OptionServiceImpl implements OptionService {

    private final DebateRepo debateRepository;

    private final OptionRepo optionRepository;

    @Override
    public Option addOptionToDebate(Option option, Long debateId) {
        Debate debate = debateRepository.findById(debateId)
                .orElseThrow(() -> new RuntimeException("Debate not found"));
        option.setDebate(debate);
        return optionRepository.save(option);
    }

    @Override
    public List<Option> getOptionsForDebate(Long debateId) {
        Debate debate = debateRepository.findById(debateId)
                .orElseThrow(() -> new RuntimeException("Debate not found"));
        return optionRepository.findByDebate(debate);
    }
}
