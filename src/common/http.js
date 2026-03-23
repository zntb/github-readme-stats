// @ts-check
import axios from "axios";

/**
 * Send GraphQL request to GitHub API.
 * @param {import('axios').AxiosRequestConfig['data']} data
 * @param {import('axios').AxiosRequestConfig['headers']} headers
 * @returns {Promise<any>}
 */
const request = (data, headers) => {
  return axios({
    url: "https://api.github.com/graphql",
    method: "post",
    headers,
    data,
  });
};

export { request };
