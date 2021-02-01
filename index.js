import express from 'express'
import path from 'path'
import dirname from 'es-dirname'

import urls from './src/routes/urls.js'

const app = express()
const port = 3000 || process.env.PORT

app.set("view engine", "ejs");
app.set("views", path.join(dirname(), "./src/views"));

app.use(express.static(path.join(dirname(), "./src/static")));

// routes
app.use("/", urls);

app.listen(port, () => {
    console.log("Server running on port " + port)
})