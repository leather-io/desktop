import { useCallback, useEffect, useState } from 'react';
import compareVersions from 'compare-versions';

import { checkForNewRelease, GithubReleases } from '@api/check-for-new-release';
import { safeAwait } from '@utils/safe-await';
import { WALLET_VERSION, NETWORK } from '@constants/index';
import { useInterval } from './use-interval';

const UPDATE_CHECK_INTERVAL = 120_000;

export function useCheckForUpdates() {
  const [newerReleaseAvailable, setNewerReleaseAvailable] = useState(false);
  const [latestRelease, setLatestRelease] = useState<null | GithubReleases[0]>(null);

  const checkForUpdate = useCallback(async () => {
    const [err, resp] = await safeAwait(checkForNewRelease());
    if (err || !resp) return;

    const latestReleases = resp
      // Prevent runtime errors incase an invalid tag makes it into upstream
      .filter(release => compareVersions.validate(release.tag_name))
      .filter(release => (NETWORK === 'mainnet' ? !release.prerelease : release.prerelease))
      .filter(release => !release.tag_name.startsWith('v3'));

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
