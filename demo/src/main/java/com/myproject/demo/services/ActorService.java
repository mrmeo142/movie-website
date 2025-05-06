package com.myproject.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myproject.demo.models.Actor;
import com.myproject.demo.repositories.ActorRepository;

@Service
public class ActorService {

    @Autowired
    private ActorRepository actorRepository;

    public List<Actor> findAllActors() {
        return actorRepository.findAll();
    }

    public Optional<Actor> findByName(String name) {
        return actorRepository.findByName(name);
    }

    public Actor createActor(Actor actor) {
        return actorRepository.save(actor);
    }

    // xóa movie
    public boolean deleteActorByName(String name) {
        Optional<Actor> actor = actorRepository.findByName(name);
        if (actor.isPresent()) {
            actorRepository.delete(actor.get());
            return true;
        } else {
            return false;
        }
    }
    public Actor updateActor(Actor actor) {
        return actorRepository.save(actor);
    }
}
