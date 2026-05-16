export const getPagination = ({ page, limit }) => {
    const skip = (page - 1) * limit;

    return {
        skip,
        take: limit
    };
};

export const buildPaginationMeta = ({ page, limit, total }) => {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages
    };
};