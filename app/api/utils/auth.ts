// This is a very simple auth method. Since this is not a complex application.
export const auth = async () => {
  const response = await fetch(
    `${process.env.AUTH_API_HOST}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        Apikey: process.env.AUTH_ANON_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.API_LOGIN_USERNAME,
        password: process.env.API_LOGIN_PASSWORD,
        gotrue_meta_security: {},
      }),
    }
  );

  //   Store this JSON in a only readable by the server. Set this token using encryption
  const token = await response.json();
  const encryptedToken = token.access_token;

  return encryptedToken;
};
