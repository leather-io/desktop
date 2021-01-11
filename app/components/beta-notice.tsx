import React, { FC } from 'react';
import { Flex, Text } from '@blockstack/ui';

import { openExternalLink } from '@utils/external-links';
import { NETWORK } from '@constants/index';
import packageJson from '../../package.json';

const sha = CONFIG.SHA;
const shaShort = sha && sha.substr(0, 7);
const pullRequest = CONFIG.PULL_REQUEST;
const branchName = CONFIG.BRANCH_NAME;
const version = packageJson.version;

const issueParams = new URLSearchParams();
const issueTitle = `[${String(packageJson.version)}] Bug: <describe issue>`;
const issueLabels = `bug,reported-from-ui,4.x,${NETWORK}`;
const issueBody = `
<!--

  Thanks for creating an issue. Please include as much detail as possible,
  including screenshots, operating system, and steps to recreate the problem.

  If you have any questions, ask @kyranjamie on Github, Discord and Twitter.

-->

Bug found testing Stacks Wallet build ${String(shaShort)}, ${String(version)}.

`;

issueParams.set('title', issueTitle);
issueParams.set('labels', issueLabels);
issueParams.set('body', issueBody);

const openIssueLink = () =>
  openExternalLink(`https://github.com/blockstack/stacks-wallet/issues/new?${String(issueParams)}`);

const openPullRequestLink = () =>
  openExternalLink(`https://github.com/blockstack/stacks-wallet/pull/${String(pullRequest)}`);

export const BetaNotice: FC = () => {
  if (!sha && !version.includes('beta')) return null;

  return (
    <Flex
      textStyle="caption.medium"
      fontSize="11px"
      color="ink.400"
      position="fixed"
      right="8px"
      bottom="8px"
      border="1px solid #F0F0F0"
      borderRadius="24px"
      bg="white"
      py="4px"
      px="base-tight"
    >
      <Text mr="tight" onClick={openIssueLink} textDecoration="underline" cursor="pointer">
        Found a bug? Open an issue
      </Text>
      {pullRequest && branchName && (
        <Text
          mr="base-tight"
          onClick={openPullRequestLink}
          textDecoration="underline"
          cursor="pointer"
        >
          {branchName}
        </Text>
      )}
      {shaShort && (
        <Text mr="base-tight">
          Commit:{' '}
          <Text
            cursor="pointer"
            textDecoration="underline"
            onClick={() =>
              openExternalLink(`https://github.com/blockstack/stacks-wallet/commit/${sha || ''}`)
            }
          >
            {shaShort}
          </Text>
        </Text>
      )}
      <Text>[{packageJson.version}]</Text>
    </Flex>
  );
};
