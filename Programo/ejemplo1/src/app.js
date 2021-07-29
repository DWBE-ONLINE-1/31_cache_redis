const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");
const app = express();

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_SERVER = process.env.REDIS_SERVER || "localhost";

// redis://localhost:6379
const redisClient = redis.createClient(`redis://${REDIS_SERVER}:${REDIS_PORT}`);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Cache middleware
function repositoriesNumberRedisCache(req, res, next) {
    const { username } = req.params;

    redisClient.get(username, (err, data) => {
        if (err) throw err;

        if (data) {
            res.status(200).json({
                username: username,
                repos: data,
            });
        } else {
            next();
        }
    });
}

// Make request to Github for data
async function getGitHubRepositoriesNumber(req, res, next) {
    try {
        console.info("Fetching data from Github...");

        const { username } = req.params;
        const gitHubResponse = await fetch(`https://api.github.com/users/${username}`);
        const data = await gitHubResponse.json();
        const repositoriesNumber = data.public_repos;

        // Set data to Redis
        // redisClient.setex(username, repositoriesNumber);
        redisClient.setex(username, 60, repositoriesNumber);

        res.status(200).json({
            username: username,
            repositoriesNumber: repositoriesNumber,
        });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}

app.get("/github/:username", repositoriesNumberRedisCache, getGitHubRepositoriesNumber);

app.listen(PORT, () => {
    console.info(`Example app listening at http://localhost:${PORT}`);
});