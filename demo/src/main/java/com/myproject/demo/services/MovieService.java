package com.myproject.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myproject.demo.models.Movie;
import com.myproject.demo.repositories.MovieRepository;

@Service
public class MovieService {

    @Autowired
    private MovieRepository repository;

    // Lấy tất cả movies từ MongoDB
    public List<Movie> findAllMovies() {
        return repository.findAll();
    }

    // Tìm movie theo imdbId
    public Optional<Movie> findMovieByImdbId(String imdbId) {
        return repository.findMovieByImdbId(imdbId);
    }

    public List<Movie> searchInMovieListByTitle(List<Movie> movies, String query) {
        return movies.stream()
            .filter(m -> m.getTitle() != null && m.getTitle().toLowerCase().contains(query.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    // Lấy đường dẫn của một tập cụ thể
    public String getMovieLink(String imdbId, int episodeIndex) throws Exception {
        Optional<Movie> movie = findMovieByImdbId(imdbId);
        if (movie.isPresent()) {
            List<String> links = movie.get().getMovieLink();
            if (links != null && episodeIndex >= 0 && episodeIndex < links.size()) {
                return links.get(episodeIndex);
            } else {
                throw new Exception("Episode not found");
            }
        }
        throw new Exception("Movie not found");
    }

    // lấy danh sách movie theo danh sách imdbId
    public List<Movie> findByImdbIds(List<String> imdbIds) {
        return repository.findByImdbIdIn(imdbIds);
    }
    
    // Movie đã chiếu: chỉ có 1 tập
    public List<Movie> findSingleMovies() {
        return repository.findAll().stream()
                .filter(m -> m.getMovieLink() != null && m.getMovieLink().size() == 1)
                .collect(Collectors.toList());
    }

    // TV Series: nhiều tập
    public List<Movie> findTVSeries() {
        return repository.findAll().stream()
                .filter(m -> m.getMovieLink() != null && m.getMovieLink().size() > 1)
                .collect(Collectors.toList());
    }

    // Movie sắp chiếu: không có tập nào
    public List<Movie> findUpcomingMovies() {
        return repository.findAll().stream()
                .filter(m -> m.getMovieLink() == null || m.getMovieLink().isEmpty())
                .collect(Collectors.toList());
    }
    // thêm Movie
    public Movie createMovie(Movie movie) {
        return repository.save(movie);
    }
    // sửa movie
    public Movie editMovie(Movie movie){
        return repository.save(movie);
    }
    // xóa movie
    public boolean deleteMovieByImdbId(String imdbId) {
        Optional<Movie> movie = repository.findMovieByImdbId(imdbId);
        if (movie.isPresent()) {
            repository.delete(movie.get());
            return true;
        } else {
            return false;
        }
    }
}
