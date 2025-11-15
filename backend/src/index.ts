import express from "express"
import dotenvx from "@dotenvx/dotenvx"

dotenvx.config()
const port = process.env.PORT

const app = express()

// application middleware
app.use(express.json())


app.listen(port, ()=>{
    console.log(`[server]: server running at http://localhost:${port}`)
})
