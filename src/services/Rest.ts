type ApiCallInput = {
  url: string;
  options?: RequestInit;
};
class Rest {
  static post(url: string, options?: RequestInit) {
    return Rest.#apiCall({ url, options: { ...options, method: 'POST' } });
  }

  static async #apiCall(args: ApiCallInput) {
    const API_URL = import.meta.env.VITE_API_URL;

    const apiCallOptions: RequestInit = {
        ...args.options,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
    const response = await fetch(`${API_URL}${args.url}`, apiCallOptions);
    const data = await response.json();

    return data;
  }
}

export default Rest;
