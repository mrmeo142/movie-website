package com.myproject.demo.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myproject.demo.models.Actor;
import com.myproject.demo.models.Movie;
import com.myproject.demo.services.ActorService;
import com.myproject.demo.services.MovieService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/actor")
public class ActorController {

    @Autowired
    private ActorService actorService;

    @Autowired
    private MovieService movieService; 

    @GetMapping
    public ResponseEntity<List<Actor>> getAllActors() {
        return new ResponseEntity<>(actorService.findAllActors(), HttpStatus.OK);
    }

    //  Lấy chi tiết 1 phim (movie hoặc tvseries) dựa vào imdbId
    @GetMapping("/detail/{name}")
    public ResponseEntity<Actor> getActorDetail(@PathVariable String name) {
        Optional<Actor> actor = actorService.findByName(name);
        return actor.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    // Lấy danh sách phim của diễn viên
    @GetMapping("/{name}/movies")
    public ResponseEntity<List<Movie>> getMoviesByActor(@PathVariable String name) {
        Optional<Actor> actor = actorService.findByName(name);
        if (actor.isPresent()) {
            List<String> imdbIds = actor.get().getMovies();
            List<Movie> movies = movieService.findByImdbIds(imdbIds);
            return new ResponseEntity<>(movies, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PostMapping("/post")
    public ResponseEntity<Actor> postMovie(@RequestBody Actor actor) {
        Actor createActor = actorService.createActor(actor);
        return new ResponseEntity<>(createActor, HttpStatus.OK);
    }
    @PutMapping("put/{name}")
    public ResponseEntity<Actor> updatetActor(@PathVariable String name, @RequestBody Actor actor) {
        Optional<Actor> editActorOpt = actorService.findByName(name);
        
        if(editActorOpt.isPresent()){
            Actor editActor = editActorOpt.get(); 
            editActor.setName(actor.getName());
            editActor.setNationality(actor.getNationality());
            editActor.setBirthDate(actor.getBirthDate());
            editActor.setMovies(actor.getMovies());
            editActor.setAvatar(actor.getAvatar());

            return new ResponseEntity<>(actorService.updateActor(editActor), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteActor(@PathVariable String name) {
        boolean deleted = actorService.deleteActorByName(name);
        if (deleted) {
            return new ResponseEntity<>("Actor deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Actor not found", HttpStatus.NOT_FOUND);
        }
    }
}
