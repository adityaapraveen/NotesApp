export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const withRetry = async (
    operation,
    {
        retries = 5,
        delayMs = 1000,
        label = "operation"
    } = {}
) => {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            console.error(`${label} failed. Attempt ${attempt}/${retries}`);

            if (attempt < retries) {
                await sleep(delayMs * attempt);
            }
        }
    }

    throw lastError;
};