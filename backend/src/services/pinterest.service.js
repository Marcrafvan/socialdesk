const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const PINTEREST_BASE = "https://api-sandbox.pinterest.com/v5";
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pinterest_posts",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

exports.getPinterestAuthUrl = () => {
  const clientId = process.env.PINTEREST_APP_ID;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;

  const scopes = [
    "boards:read",
    "boards:write",
    "pins:read",
    "pins:write",
  ].join(",");

  return `https://www.pinterest.com/oauth/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scopes}&state=123`;
};

exports.handlePinterestOAuth = async (code) => {
  const clientId = process.env.PINTEREST_APP_ID;
  const clientSecret = process.env.PINTEREST_APP_SECRET;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);

  const authHeader = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const res = await axios.post(
    `${PINTEREST_BASE}/oauth/token`,
    params,
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
};


exports.createPinterestBoard = async ({
  accessToken,
  name,
  description,
}) => {
  if (!accessToken || !name) {
    throw new Error("accessToken and name are required");
  }

  const payload = {
    name,
    description: description || "",
  };

  const res = await axios.post(
    `${PINTEREST_BASE}/boards`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};


exports.createPinterestPin = async ({
  accessToken,
  boardId,
  title,
  description,
  link,
  file,
}) => {
  if (!file) throw new Error("Image file is required");
  console.log(accessToken);


  const uploadResult = await uploadToCloudinary(file);
  const imageUrl = uploadResult.secure_url;

  const payload = {
    board_id: boardId,
    title: title || "",
    description: description || "",
    link: link || "",
    media_source: {
      source_type: "image_url",
      url: imageUrl,
    },
  };

  const res = await axios.post(
    `${PINTEREST_BASE}/pins`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return {
    pin: res.data,
    imageUrl,
  };
};