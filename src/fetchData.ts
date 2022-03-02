export type FetchResult<Data> = {
  data?: Data;
  httpStatus?: number;
  error?: string;
  timedOut?: boolean;
};

export default async function fetchData<Data>(
  requestUrl: string,
  method = "GET",
  timeout = 0
): Promise<FetchResult<Data>> {
  const abortController = new AbortController();

  if (timeout) {
    setTimeout(() => abortController.abort(), timeout);
  }

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method,
      signal: abortController.signal,
    });
  } catch (err) {
    const error = err as Error;
    return {
      error: `Error: ${error.message}`,
      timedOut: error.name === "AbortError",
    };
  }

  if (!response.ok) {
    return {
      error: `HTTP error (${response.status})`,
      httpStatus: response.status,
    };
  }

  const data = await response.json();
  return { data, httpStatus: response.status };
}
