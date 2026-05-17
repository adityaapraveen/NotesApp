export const cosineSimilarity = (vectorA, vectorB) => {
    if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
        return 0;
    }

    if (vectorA.length === 0 || vectorA.length !== vectorB.length) {
        return 0;
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let index = 0; index < vectorA.length; index += 1) {
        const a = Number(vectorA[index]);
        const b = Number(vectorB[index]);

        dotProduct += a * b;
        magnitudeA += a * a;
        magnitudeB += b * b;
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};