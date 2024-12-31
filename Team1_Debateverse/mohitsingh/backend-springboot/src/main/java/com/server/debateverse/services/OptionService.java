package com.server.debateverse.services;

import java.util.List;

import com.server.debateverse.entities.Option;

public interface OptionService {
    Option addOptionToDebate(Option option, Long debateId);
    List<Option> getOptionsForDebate(Long debateId);

    void blockOption(Long optionId, Long debateId);

    void unblockOption(Long optionId, Long debateId);
}
