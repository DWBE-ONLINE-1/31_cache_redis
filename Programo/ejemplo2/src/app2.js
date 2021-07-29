let apiBenchmark = require("api-benchmark");
const fs = require("fs");

let services = {
    server1: "http://localhost:5000/",
};
let options = {
    minSamples: 100,
};

let routeWithoutCache = { route1: "/github/cyberhavok?email=Nathan@yesenia.net" };
// let routeWithCache = { route1: "cached-users?email=Nathan@yesenia.net" };

apiBenchmark.measure(
    services,
    routeWithoutCache,
    options,
    function (err, results) {
        apiBenchmark.getHtml(results, function (error, html) {
            fs.writeFile("no-cache-results.html", html, function (err) {
                if (err) return console.log(err);
            });
        });
    }
);

// apiBenchmark.measure(
//     services,
//     routeWithCache,
//     options,
//     function (err, results) {
//         apiBenchmark.getHtml(results, function (error, html) {
//             fs.writeFile("cache-results.html", html, function (err) {
//                 if (err) return console.log(err);
//             });
//         });
//     }
// );