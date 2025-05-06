package com.myproject.demo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.myproject.demo.models.Movie;
import com.myproject.demo.services.MovieService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    //  Lấy tất cả phim (bao gồm movie, tvseries, upcoming)
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return new ResponseEntity<>(movieService.findAllMovies(), HttpStatus.OK);
    }

    //  Lấy chi tiết 1 phim (movie hoặc tvseries) dựa vào imdbId
    @GetMapping("/detail/{imdbId}")
    public ResponseEntity<Movie> getMovieDetail(@PathVariable String imdbId) {
        Optional<Movie> movie = movieService.findMovieByImdbId(imdbId);
        return movie.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //  Stream video ẩn URL
    @GetMapping("/stream/{imdbId}/{index}")
    public RedirectView streamMovie(@PathVariable String imdbId, @PathVariable int index) {
        try {
            String movielink = movieService.getMovieLink(imdbId, index);
            return new RedirectView(movielink);
        } catch (Exception e) {
            return new RedirectView("https://api.memegen.link/images/rollsafe/When_you_have_a_really_good_idea.webp?layout=top");
        }
    }

    //  Lấy danh sách phim lẻ (1 tập)
    @GetMapping("/movie")
    public ResponseEntity<List<Movie>> getSingleMovies() {
        return new ResponseEntity<>(movieService.findSingleMovies(), HttpStatus.OK);
    }

    //  Lấy danh sách TV Series (nhiều tập)
    @GetMapping("/series")
    public ResponseEntity<List<Movie>> getTVSeries() {
        return new ResponseEntity<>(movieService.findTVSeries(), HttpStatus.OK);
    }

    //  Lấy danh sách phim sắp chiếu (chưa có link)
    @GetMapping("/upcoming")
    public ResponseEntity<List<Movie>> getUpcomingMovies() {
        return new ResponseEntity<>(movieService.findUpcomingMovies(), HttpStatus.OK);
    }
    
    @GetMapping("/series/search")
    public ResponseEntity<List<Movie>> searchSeries(@RequestParam("query") String query) {
        List<Movie> series = movieService.findTVSeries();
        List<Movie> results = movieService.searchInMovieListByTitle(series, query);
        return new ResponseEntity<>(results, HttpStatus.OK);
}

    //  Tìm kiếm phim theo tiêu đề
    @GetMapping("/movie/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam("query") String query) {
        List<Movie> movies = movieService.findSingleMovies();
        List<Movie> results = movieService.searchInMovieListByTitle(movies, query);
        return new ResponseEntity<>(results, HttpStatus.OK);
    } 

    @PostMapping("/post")
    public ResponseEntity<Movie> postMovie(@RequestBody Movie movie) {
        Movie createMovie = movieService.createMovie(movie);
        return new ResponseEntity<>(createMovie, HttpStatus.OK);
    }
    
    @PutMapping("put/{imdbId}")
    public ResponseEntity<Movie> putMovie(@PathVariable String imdbId, @RequestBody Movie updateMovie) {
        Optional<Movie> movie = movieService.findMovieByImdbId(imdbId);
        if(movie.isPresent()){
            Movie movieEdit = movie.get();
            movieEdit.setImdbId(updateMovie.getImdbId());
            movieEdit.setTitle(updateMovie.getTitle());
            movieEdit.setReleaseDate(updateMovie.getReleaseDate());
            movieEdit.setTrailerLink(updateMovie.getTrailerLink());
            movieEdit.setGenres(updateMovie.getGenres());
            movieEdit.setPoster(updateMovie.getPoster());
            movieEdit.setBackdrops(updateMovie.getBackdrops());
            movieEdit.setMovielink(updateMovie.getMovieLink());
            movieEdit.setActors(updateMovie.getActors());
            return new ResponseEntity<>(movieService.editMovie(movieEdit), HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/delete/{imdbId}")
    public ResponseEntity<String> deleteMovie(@PathVariable String imdbId) {
        boolean deleted = movieService.deleteMovieByImdbId(imdbId);
        if (deleted) {
            return new ResponseEntity<>("Movie deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Movie not found", HttpStatus.NOT_FOUND);
        }
    }
    
}
