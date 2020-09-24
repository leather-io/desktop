import React, { FC } from 'react';
import { Flex, Text } from '@blockstack/ui';
import { openExternalLink } from '@utils/external-links';

import packageJson from '../../package.json';

const sha = process.env.SHA;
const buildDate = process.env.BUILD_DATE;

const issueParams = new URLSearchParams();

const issueTitle = `[${String(packageJson.version)}] Bug: <describe issue>`;
const issueLabels = 'bug,reported-from-ui';
const issueBody = `
<!--

  Thanks for creating an issue. Please include as much detail as possible,
  including screenshots, operating system, and steps to recreate.

  If you have any questions, ask @kyranjamie on Github, Discord and Twitter.

-->

Bug found testing Stacks Wallet build ${String(sha)}, ${String(buildDate)}.

`;

issueParams.set('title', issueTitle);
issueParams.set('labels', issueLabels);
issueParams.set('body', issueBody);

const openIssueLink = () =>
  openExternalLink(
    `https://github.com/blockstack/stacks-wallet/issues/new?${issueParams.toString()}`
  );

export const BetaNotice: FC = () => {
  if (!sha && !buildDate) return null;
  return (
    <Flex
      textStyle="caption.medium"
      color="ink.400"
      position="fixed"
      right={0}
      bottom="base"
      flexDirection={['column', 'row']}
    >
      <Text mr="base" onClick={openIssueLink} textDecoration="underline" cursor="pointer">
        Found a bug? Open an issue
      </Text>
      {/* <Text mr="base">
        Commit:{' '}
        <Text
          cursor="pointer"
          textDecoration="underline"
          onClick={() =>
            openExternalLink(
              `https://github.com/blockstack/stacks-wallet/pull/203/commits/${sha || ''}`
            )
          }
        >
          {sha}
        </Text>
      </Text> */}
      <Text mr="base">Build date: {buildDate}</Text>
    </Flex>
  );
};
