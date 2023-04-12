import { useInterval } from './use-interval';
import { checkForNewRelease, GithubReleases } from '@api/check-for-new-release';
import { WALLET_VERSION } from '@constants/index';
import { whenNetwork } from '@utils/network-utils';
import { safeAwait } from '@utils/safe-await';
import compareVersions from 'compare-versions';
import { useCallback, useEffect, useState } from 'react';

const UPDATE_CHECK_INTERVAL = 300_000;
const NEW_WALLET_STARTING_MAJOR_VERSION = whenNetwork<string>({
  mainnet: '4.0.0',
  testnet: '4.0.0-beta.0',
});

export function useCheckForUpdates() {
  const [newerReleaseAvailable, setNewerReleaseAvailable] = useState(false);
  const [latestRelease, setLatestRelease] = useState<null | GithubReleases[0]>(null);

  const checkForUpdate = useCallback(async () => {
    const [err, resp] = await safeAwait(checkForNewRelease());
    if (err || !resp) return;

    const latestReleases = resp
      // Prevent runtime errors incase an invalid tag makes it into upstream
      .filter(release => compareVersions.validate(release.tag_name))
      .filter(release => whenNetwork({ mainnet: !release.prerelease, testnet: release.prerelease }))
      .filter(release => release.tag_name.startsWith('v'))
      .filter(release =>
        compareVersions.compare(release.tag_name, NEW_WALLET_STARTING_MAJOR_VERSION, '>')
      );

    if (latestReleases[0]) setLatestRelease(latestReleases[0]);

    const isThereNewerRelease = latestReleases.some(release =>
      compareVersions.compare(release.tag_name, WALLET_VERSION, '>')
    );

    setNewerReleaseAvailable(isThereNewerRelease);
  }, []);

  useEffect(() => void checkForUpdate(), [checkForUpdate]);

  useInterval(() => void checkForUpdate(), UPDATE_CHECK_INTERVAL);

  return { isNewerReleaseAvailable: newerReleaseAvailable, latestRelease };
}
