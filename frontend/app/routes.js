import EmailVerification from "./components/pages/email-verification.js";
import AuthGuard from "./guards/authGuard.js";
import LoginGuard from "./guards/loginGuard.js";

const errorsRoutes = [
	{
		path: "/404",
		component: () => import("./components/pages/notfound.js"),
	},
];

// Define routes with all components as functions returning a promise
export const routes = [
	...errorsRoutes,
	{
		path: "/",
		component: () => import("./components/pages/landing.js"),
	},
	{
		path: "/components",
		component: () => import("./components/pages/components.js"),
	},
	{
		path: "/local",
		component: () => import("./components/pages/local.js"),
		children: [
			{
				path: "/1v1",
				component: () => import("./components/pages/one-vs-one.js"),
				children: [
					{
						path: "/game",
						component: () => import("./components/pages/gameplay.js"),
					},
				],
			},
			{
				path: "/tournament",
				component: () => import("./components/pages/tournament.js"),
				children: [
					{
						path: "/game",
						component: () => import("./components/pages/tournament-game.js"),
					},
					{
						path: "/qualifications",
						component: () => import("./components/pages/qualifications.js"),
					},
				],
			},

		],
	},
	{
		path: "/dashboard",
		canActivate: [AuthGuard],
		children: [
			{
				path: "/home",
				component: () => import("./components/pages/dashboard-home.js"),
			},
			{
				path: "/chat",
				component: () => import("./components/pages/chat.js"),
			},
			{
				path: "/tournaments",
				component: () => import("./components/pages/dashboard-tournament.js"),
			},
			{
				path: "/quests",
				component: () => import("./components/pages/dashboard-home.js"),
			},
			{
				path: "/shop",
				component: () => import("./components/pages/dashboard-home.js"),
			},
			{
				path: "/settings",
				component: () => import("./components/pages/settings.js"),
				children: [
					{
						path: "/game",
						component: () => import("./components/pages/settings.js"),
					},	
					{
						path: "/privacy",
						component: () => import("./components/pages/settings-privacy.js"),
					},	
				]
			},
			{
				path: "/profile",
				component: () => import("./components/pages/profile.js"),
			},
		],
	},
	{
		path: "/login",
		canActivate: [LoginGuard],
		component: () => import("./components/pages/login.js"),
	},
	{
		path: "/register",
		canActivate: [LoginGuard],
		component: () => import("./components/pages/sign-up.js"),
	},
	{
		path: "/oauth2/callback/:provider",
		component: () => import("./components/pages/oauth2.js"),
	},
	{
		path: "/email-verification",
		canActivate: [AuthGuard], // add EmailVerifiedGuard
		component: () => import("./components/pages/email-verification.js"),
	},
	{
		path: "/verify-2fa",
		canActivate: [LoginGuard],
		component: () => import("./components/pages/verify-two-factor-auth.js"),
	},
	{
		path: "/forgot-password",
		canActivate: [LoginGuard],
		component: () => import("./components/pages/email-reset-password.js"),
	},
	{
		path: "/reset-password",
		canActivate: [LoginGuard],
		component: () => import("./components/pages/reset-password.js"),
	},
	{
		path: "/reset-2fa",
		canActivate: [LoginGuard],
		component: () => import("./components/pages/email-reset-two-factor.js"),
	},
	{
		path: "/resend-verification-email",
		canActivate: [AuthGuard],
		component: () => import("./components/pages/resend-verification-email.js"),
	},
];
