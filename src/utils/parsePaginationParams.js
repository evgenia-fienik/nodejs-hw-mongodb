const parseNumber = (value, defaultValue) => {
  const parsedNumber = Number(value);

  return Number.isNaN(parsedNumber) || parsedNumber <= 0
    ? defaultValue
    : parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
