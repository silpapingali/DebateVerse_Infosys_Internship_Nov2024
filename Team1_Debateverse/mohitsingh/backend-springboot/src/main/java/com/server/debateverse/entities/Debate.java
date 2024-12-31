package com.server.debateverse.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Debate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy= "debate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Option> options;

    @ManyToMany
    private List<User> likes = new ArrayList<>();

    @ManyToMany
    private List<User> dislikes = new ArrayList<>();

    @Column(nullable = false)
    private boolean isPublic = true;

    @Column(nullable = false)
    private boolean isBlocked = false;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDate createdOn;

    @Transient
    private int totalVotes;

    @Transient
    private int totalLikes;

    @Transient
    private int totalDislikes;

    @PostLoad
    private void calculateDerivedFields() {
        this.totalVotes = options.stream()
                .flatMap(option -> option.getVotes().stream())
                .mapToInt(Vote::getVotes)
                .sum();
        this.totalLikes = likes.size();
        this.totalDislikes = dislikes.size();
        
    }
}
