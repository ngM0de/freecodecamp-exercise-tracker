import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {connectDB} from "./db.js";
import {router} from "./router.js";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
dotenv.config()
connectDB().then(() => console.log(`db connected`)).catch(console.log)
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded())
app.use('/api', router)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
