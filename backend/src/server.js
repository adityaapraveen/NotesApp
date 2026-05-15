import { app } from "./app.js";
import { config } from "./config/config.js";

app.listen(3000, () => {
    console.log(`Server running at PORT: ${config.PORT} IN ${config.NODE_ENV} MODE`)
})