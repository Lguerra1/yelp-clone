require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const db = require("./db")

// logging tool for requests
app.use(morgan("dev"));

app.use(cors());

//function that runs before hitting route handlers (middleware)
// "next" function moves to the next step
app.use(express.json());

//get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        const restaurantRatingsData = await db.query("select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;");
        res.status(200).json({
            status: "success",
            results: restaurantRatingsData.rows.length,
            data: {
                restaurants: restaurantRatingsData.rows
            },
        });
    } catch (err) {
        console.log(err)
    }
});

//get a single restaurant
// never use string interpolation on sql, use parameterized query to avoid sql injections
app.get("/api/v1/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const restaurant = await db.query("select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1;", [id]);
        const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id = $1", [id]);

        res.status(200).json({
            status: "success",
            results: restaurant.rows.length,
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            },
        });
    } catch (err) {
        console.log(err)
    }

});

//create restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    const { name, location, price_range } = req.body;
    try {
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *", [name, location, price_range]);
        res.status(201).json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurant: results.rows[0]
            },
        });
    } catch (err) {
        console.log(err)
    }
});

//update restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    const { name, location, price_range } = req.body;
    const id = req.params.id
    try {
        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *", [name, location, price_range, id]);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                results: results.rows[0]
            },
        });
    } catch (err) {
        console.log(err)
    }

});

//delete restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE from reviews where restaurant_id = $1", [id]);
        await db.query("DELETE from restaurants where id = $1", [id]);
        res.status(204).json({
            status: "success"
        });
    } catch (err) {
        console.log(err)
    }
});

//add review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    const { id } = req.params;
    const { name, review, rating } = req.body;
    try {
        const newReview = await db.query("INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;", [id, name, review, rating]);
        console.log(newReview);
        res.status(201).json({
            status: "success",
            results: newReview.rows.length,
            data: {
                review: newReview.rows[0]
            }
        })
    } catch (err) {
        console.log(err)
    }
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});