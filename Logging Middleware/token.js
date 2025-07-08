let cachedToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsb3ZlcHJlZXRzaW5naDk4MTA1NzM0NzVAZ21haWwuY29tIiwiZXhwIjoxNzUxOTUyOTI1LCJpYXQiOjE3NTE5NTIwMjUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0MzRlZWJmYi0yMjc2LTQ5ZTMtODg5MS0yYjVkYWRkYmUyOGMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJsb3ZlcHJlZXQgc2luZ2giLCJzdWIiOiI3YTg0ZWFjNy1mMGZkLTRjYWMtODNjMC1iODVkNTMzOWU5ZWIifSwiZW1haWwiOiJsb3ZlcHJlZXRzaW5naDk4MTA1NzM0NzVAZ21haWwuY29tIiwibmFtZSI6ImxvdmVwcmVldCBzaW5naCIsInJvbGxObyI6IjA1NDEzMjAyNzIyIiwiYWNjZXNzQ29kZSI6IlZQcHNtVCIsImNsaWVudElEIjoiN2E4NGVhYzctZjBmZC00Y2FjLTgzYzAtYjg1ZDUzMzllOWViIiwiY2xpZW50U2VjcmV0IjoiSnJWbVVna1p5dnhocGt5eSJ9.lPeECNbB3QlF_wp3lx5zKHv1NA5cay6HCNSM49srcHk";
let cachedExpiry = 0;

export const getAccessToken = async (): Promise<string> => {
  const now = Date.now();
  if (cachedToken && now < cachedExpiry) return cachedToken;

  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "lovepreetsingh9810573475@gmail.com",
        name: "lovepreet singh",
        rollNo: "05413202722",
        accessCode: "VPpsmT",
        clientID: "7a84eac7-f0fd-4cac-83c0-b85d5339e9eb",
        clientSecret: "JrVmUgkZyvxhpkyy",
      }),
    });

    const data = await res.json();
    if (!res.ok) return "";

    cachedToken = data.access_token;
    cachedExpiry = now + data.expires_in * 1000;

    return cachedToken;
  } catch (error) {
    return "";
  }
};
