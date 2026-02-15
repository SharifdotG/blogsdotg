const authConfig = {
    providers: [
        {
            domain: process.env.CONVEX_SITE_URL,
            applicationID: "convex",
            jwks: process.env.JWKS,
        },
    ],
};

export default authConfig;
