import { EventParams } from '@segment/analytics-next/dist/types/core/arguments-resolver';
import { useHasUserGivenDiagnosticPermissions } from '@store/settings';
import { getAnalytics } from '@utils/init-segment';
import packageJson from '../../package.json';
import { NETWORK } from '@constants/index';

export function useAnalytics() {
  const diagnosticsEnabled = useHasUserGivenDiagnosticPermissions();
  const analytics = getAnalytics();
  const defaultProperties = {
    version: packageJson.version,
    network: NETWORK,
  };

  const defaultOptions = {
    context: { ip: '0.0.0.0' },
  };

  return {
    track: async (...args: EventParams) => {
      if (!analytics || !diagnosticsEnabled) return;
      const [eventName, properties, options, ...rest] = args;

      const prop = { ...defaultProperties, ...properties };
      const opts = { ...defaultOptions, ...options };

      return analytics.track(eventName, prop, opts, ...rest).catch(console.error);
    },
  };
}
