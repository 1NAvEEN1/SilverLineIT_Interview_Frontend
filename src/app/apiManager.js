export const post = async ({ path, requestBody, header = {} }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  console.log(baseUrl);

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
    body: JSON.stringify(requestBody),
  });
  const body = await response.json();
  return body;
};

export const get = async ({ path, header = {} }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
  });

  const body = await response.json();
  return body;
};
