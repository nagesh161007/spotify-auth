require("dotenv").config();

async function handler(request, response) {
  const endpointUrl = new URL("https://accounts.spotify.com/api/token");

  const queryParameters = new URLSearchParams({
    grant_type: "client_credentials"
  });

  const required_ids = Buffer.from(
    "8260cb49e7274906ad6af18d9c8f63ca:08e425987a624763b8dec94b15f9986a"
  );
  const encoded = required_ids.toString("base64");

  const headerParameters = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + encoded
  };

  const options = {
    method: "POST",
    headers: headerParameters
  };

  try {
    endpointUrl.search = queryParameters;
    const res = await fetch(endpointUrl, options);
    const data = await res.json();
    console.log(data);
    response.status(200).json({ accessToken: data.access_token });
  } catch (error) {
    console.log(error);
  }
}

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

module.exports = allowCors(handler);
