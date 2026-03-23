// @ts-check
import { retryer } from "../common/retryer.js";
import { MissingParamError } from "../common/error.js";
import { request } from "../common/http.js";

const QUERY = `
query gistInfo($gistName: String!) {
  viewer {
    gist(name: $gistName) {
      description
      owner { login }
      stargazerCount
      forks { totalCount }
      files { name language { name } size }
    }
  }
}
`;

const fetcher = async (variables, token) => {
  return await request({ query: QUERY, variables }, { Authorization: `token ${token}` });
};

const calculatePrimaryLanguage = (files) => {
  if (!files || files.length === 0) return "Unknown";
  const languages = {};
  for (const file of files) {
    if (file.language) {
      languages[file.language.name] = (languages[file.language.name] || 0) + file.size;
    }
  }
  let primaryLanguage = Object.keys(languages)[0] || "Unknown";
  for (const language in languages) {
    if (languages[language] > languages[primaryLanguage]) primaryLanguage = language;
  }
  return primaryLanguage;
};

const fetchGist = async (id) => {
  if (!id) throw new MissingParamError(["id"], "/api/gist?id=GIST_ID");
  const res = await retryer(fetcher, { gistName: id });
  if (res.data.errors) throw new Error(res.data.errors[0].message);
  if (!res.data.data.viewer.gist) throw new Error("Gist not found");
  const data = res.data.data.viewer.gist;
  return {
    name: data.files[Object.keys(data.files)[0]].name,
    nameWithOwner: `${data.owner.login}/${data.files[Object.keys(data.files)[0]].name}`,
    description: data.description,
    language: calculatePrimaryLanguage(data.files),
    starsCount: data.stargazerCount,
    forksCount: data.forks.totalCount,
  };
};

export { fetchGist };
export default fetchGist;
