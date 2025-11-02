import { mergeDeepRight } from 'ramda';
const DEFAULT_SITE_NAME = 'Openfav';
const getSite = (config) => {
    const _default = {
        name: DEFAULT_SITE_NAME,
        site: 'https://openfav.vercel.app/',
        base: '/',
        trailingSlash: false,
        googleSiteVerificationId: ''
    };
    return mergeDeepRight({}, _default, config?.site ?? {});
};
const getI18N = (config) => {
    const _default = {
        language: 'en',
        textDirection: 'ltr',
    };
    const value = mergeDeepRight({}, _default, config?.i18n ?? {});
    return value;
};
const getMetadata = (config) => {
    const siteConfig = getSite(config);
    const _default = {
        title: {
            default: siteConfig?.name || DEFAULT_SITE_NAME,
            template: '%s',
        },
        description: '',
        robots: {
            index: false,
            follow: false,
        },
        openGraph: {
            type: 'website'
        }
    };
    return mergeDeepRight({}, _default, config?.metadata ?? {});
};
const getAnalytics = (config) => {
    const _default = {
        vendors: {
            googleAnalytics: {
                id: undefined,
                partytown: true,
            }
        }
    };
    return mergeDeepRight({}, _default, config?.analytics ?? {});
};
const getUI = (config) => {
    const _default = {
        theme: 'system',
    };
    return mergeDeepRight({}, _default, config?.ui ?? {});
};
export default (config) => ({
    SITE: getSite(config),
    METADATA: getMetadata(config),
    ANALYTICS: getAnalytics(config),
    I18N: getI18N(config),
    UI: getUI(config)
});
