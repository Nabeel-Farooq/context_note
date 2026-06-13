import appendQuery from 'append-query';

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object';
};

export const getObjectType = (value: unknown): string => {
  return Object.prototype.toString.call(value);
};

export const removeUrlPostfix = (url: string): string => {
  const queryIndex = url.indexOf('?');
  const hashIndex = url.indexOf('#');

  let endIndex = url.length;

  if (queryIndex !== -1) {
    endIndex = queryIndex;
  }

  if (hashIndex !== -1 && hashIndex < endIndex) {
    endIndex = hashIndex;
  }

  return url.slice(0, endIndex);
};

export const getUrlQuery = (
  url: string
): Record<string, string> => {
  const queryIndex = url.indexOf('?');

  if (queryIndex === -1) {
    return {};
  }

  const queryString = url
    .slice(queryIndex + 1)
    .split('#')[0];

  return Object.fromEntries(
    new URLSearchParams(queryString).entries()
  );
};

// export const appendUrlQuery = (
//   url: string,
//   query: Record<string, unknown>
// ) => {
//   return appendQuery(url, query)
// }

export const appendUrlQuery = (
  baseUrl: string,
  params: Record<string, unknown>
): string => {
  try {
    const url = new URL(baseUrl);
    const searchParams = url.searchParams;

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }

    return url.toString();
  } catch {
    return appendQuery(baseUrl, params);
  }
};
