import express from 'express'

export const app = express()
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({
        message: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})

