import { GITHUB_ORG, GITHUB_REPO } from '@constants/index';
import { Endpoints } from '@octokit/types';
import axios from 'axios';

export type GithubReleases = Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

export async function checkForNewRelease() {
  const resp = await axios.get<GithubReleases>(
    `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/releases`
  );
  return resp.data;
}
