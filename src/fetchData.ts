type FetchResult<Data> = {
  data?: Data;
  httpStatus?: number;
  error?: string;
};

export default async function fetchData<Data>(
  requestUrl: string,
  method = "GET"
): Promise<FetchResult<Data>> {
  let response: Response;

  try {
    response = await fetch(requestUrl, { method });
  } catch (err) {
    const message = (err as Error).message;
    return { error: `Error: ${message}` };
  }

  if (!response.ok) {
    return {
      error: `HTTP Error (${response.status})`,
      httpStatus: response.status,
    };
  }

  const data = await response.json();
  return { data, httpStatus: response.status };
}
