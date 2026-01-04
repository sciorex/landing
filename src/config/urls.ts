import {
  getConfig,
  getDownloadBaseUrl,
  getGitHostUrls,
  getProviderName,
  type GitProvider,
} from '@sciorex/shared-config';

// Get the current configuration
const config = getConfig();

// Git provider info
export const GIT_PROVIDER: GitProvider = config.gitProvider;
export const GIT_PROVIDER_NAME = getProviderName(config.gitProvider);

// Repository URLs
const appRepoUrls = getGitHostUrls(
  config.gitProvider,
  config.gitOrg,
  config.repos.app
);

export const REPO_URL = appRepoUrls.base;
export const ISSUES_URL = appRepoUrls.issues;
export const RELEASES_URL = appRepoUrls.releases;
export const NEW_ISSUE_URL = appRepoUrls.newIssue;

// Download URLs
export const DOWNLOAD_BASE_URL = getDownloadBaseUrl(config);

// Documentation
export const DOCS_URL = config.docsUrl;

// Social URLs
export const DISCORD_URL = config.socials.discord;
export const TWITTER_URL = config.socials.twitter;
export const SPONSOR_URL = config.socials.sponsor;

// Website
export const WEBSITE_URL = config.websiteUrl;

// Re-export the config for advanced usage
export { config };
