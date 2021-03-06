'use strict';

module.exports = {
	db: process.env.MONGOLAB_URI || 'mongodb://localhost/small-scope-dev',
	app: {
		title: 'small-scope - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1642001089352751',
		clientSecret: process.env.FACEBOOK_SECRET || '65e09286f89d1af6c24108b95de9dfc4',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'QOgBwnctBfTHECjlzOruI4MpC',
		clientSecret: process.env.TWITTER_SECRET || 'PXfg0xuZ8Uz9hXVOAReMuenuMctw5bKteiwbFADQWeZ8Nekus0',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
