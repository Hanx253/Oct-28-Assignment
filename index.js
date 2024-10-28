import express from 'express';
import fs from 'fs/promises';

const app = express();
const port = process.env.PORT || 3001;

let jsonData;

const readJson = async () => {
    const data = await fs.readFile('data.json', 'utf-8');
    jsonData = JSON.parse(data);
}

readJson().then(() => {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    })
})


app.get('/movies', (req, res) => {
    res.send(jsonData.movies);
})


app.get('/movies/title/:title', (req, res) => {
    const title = req.params.title;
    const movies = jsonData.movies;
    const foundMovie = movies.find(movie => movie.name === title);

    if (foundMovie) {
        res.send(foundMovie);
    }
})


app.get('/movies/actor/:actor', (req, res) => {
    const castName = req.params.actor;
    const movies = jsonData.movies;

    let foundCast = [];

    movies.forEach(movie => {
        movie.cast.forEach(actor => {
            if (actor.name.includes(castName)) {
                foundCast.push(movie);
            }
        })
    })
    
    res.send(foundCast);

})


app.get('/movies/director/:director', (req, res) => {
    const directorName = req.params.director;
    const movies = jsonData.movies;

    let foundDirector = [];

    movies.forEach(movie => {
        if (movie.director.name.includes(directorName)) {
            foundDirector.push(movie.name);
        }
    })
    
    res.send(foundDirector);

})


app.get('/movies/rating', (req, res) => {
    const minRating = parseFloat(req.query.min);
    const movies = jsonData.movies;

    let foundMovie = [];

    movies.forEach(movie => {
        if (movie.rating >= minRating) {
            foundMovie.push(movie.name); 
        }
    })

    res.send(foundMovie);

})
