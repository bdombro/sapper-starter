/**
 * Helper functions to access the Sapper Rest API
 **/

/**
 * Fetch with features to resolve relative URLs and auto-jsonify the body
 *
 * @param uri: URL to fetch from.
 *   "" or ".": current url + .json
 *   "<string>": a path relative to the current url
 *   "/<string>" a path relative to the root url
 * @param bodyObj: Like options.body, but is auth-JSONified
 * @param options: Standard fetch options
 */
const fetchApi: FetchApi = async (uri, bodyObj, options) => {
  let input = uri ?? location.pathname;
  if (input === ".") input = location.pathname;
  if (!input.startsWith("/")) input = location.pathname + "/" + input;
  if (!input.endsWith(".json")) input = input + ".json";
  const init = {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...(bodyObj && { body: JSON.stringify(bodyObj) }),
  };
  const res = await fetch(input, init);
  return res;
};

/**
 * Factory to easily create get, post, etc. specific fetch functions
 * @param method
 */
const factory: FetchApiFactory = (method: string) => {
  return (uri, bodyObj, options) =>
    fetchApi(uri, bodyObj, { ...options, method });
};

export default {
  fetch: fetchApi,
  get: factory("GET"),
  post: factory("POST"),
  patch: factory("PATCH"),
  put: factory("PUT"),
  delete: factory("DELETE"),
};

type FetchApi = (
  uri: string,
  bodyObj?: object,
  options?: RequestInit
) => Promise<Response>;
type FetchApiFactory = (method: string) => FetchApi;
