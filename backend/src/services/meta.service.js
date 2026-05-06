const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const FB_BASE = "https://graph.facebook.com/v25.0";


const cloudinary = require("../config/cloudinary");



exports.getAuthUrl = () => {
  return `https://www.facebook.com/v25.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.FB_REDIRECT_URI}&scope=pages_show_list,pages_manage_posts,pages_read_engagement,business_management,instagram_basic,instagram_content_publish`;
};


exports.handleOAuth = async (code) => {
  
  const tokenRes = await axios.get(`${FB_BASE}/oauth/access_token`, {
    params: {
      client_id: process.env.FB_APP_ID,
      client_secret: process.env.FB_APP_SECRET,
      redirect_uri: process.env.FB_REDIRECT_URI,
      code,
    },
  });

  const userAccessToken = tokenRes.data.access_token;

  const pagesRes = await axios.get(`${FB_BASE}/me/accounts`, {
    params: {
      access_token: userAccessToken,
    },
  });

  return {
    user_access_token: userAccessToken,
    pages: pagesRes.data.data,
  };
};




exports.postToPage = async ({ pageId, pageAccessToken, message, scheduledTime }) => {
  const url = `${FB_BASE}/${pageId}/feed`;

  const data = {
    message,
    published: scheduledTime ? false : true,
    scheduled_publish_time: scheduledTime || undefined,
  };

  const res = await axios.post(url, data, {
    params: {
      access_token: pageAccessToken,
    },
  });

  return res.data;
};


async function postPhotoToPage({ pageId, pageAccessToken, caption, filePath }) {
  const url = `${FB_BASE}/${pageId}/photos`;

  const form = new FormData();
  form.append("source", fs.createReadStream(filePath));
  if (caption) form.append("caption", caption);

  const response = await axios.post(url, form, {
    headers: {
      ...form.getHeaders(),
    },
    params: {
      access_token: pageAccessToken,
    },
  });

  return response.data;
}



const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const isVideo = file.mimetype.startsWith("video/");

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "social_posts",
        resource_type: isVideo ? "video" : "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};



const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

exports.createInstagramPost = async ({
  igUserId,
  pageAccessToken,
  caption,
  file,
}) => {
  if (!file) throw new Error("Image file is required");

 
  const uploadResult = await uploadToCloudinary(file);
  const imageUrl = uploadResult.secure_url;

  
  const createRes = await axios.post(
    `${FB_BASE}/${igUserId}/media`,
    null,
    {
      params: {
        image_url: imageUrl,
        caption: caption || "",
        access_token: pageAccessToken,
      },
    }
  );

  const creationId = createRes.data.id;

  
  await sleep(3000);

 
  const publishRes = await axios.post(
    `${FB_BASE}/${igUserId}/media_publish`,
    null,
    {
      params: {
        creation_id: creationId,
        access_token: pageAccessToken,
      },
    }
  );

  return {
    mediaId: publishRes.data.id,
    imageUrl,
  };
};

exports.createInstagramReelPost = async ({
  igUserId,
  pageAccessToken,
  caption,
  file,
}) => {
  const uploadResult = await uploadToCloudinary(file);
  const videoUrl = uploadResult.secure_url;

  
  const createRes = await axios.post(
    `${FB_BASE}/${igUserId}/media`,
    null,
    {
      params: {
        video_url: videoUrl,
        caption: caption || "",
        media_type: "REELS",
        access_token: pageAccessToken,
      },
    }
  );

  const creationId = createRes.data.id;

  
  let status = "IN_PROGRESS";

  for (let i = 0; i < 10; i++) {
    const statusRes = await axios.get(
      `${FB_BASE}/${creationId}`,
      {
        params: {
          fields: "status_code",
          access_token: pageAccessToken,
        },
      }
    );

    status = statusRes.data.status_code;

    if (status === "FINISHED") break;

    await sleep(3000); 
  }

  if (status !== "FINISHED") {
    throw new Error("Reel not ready for publishing after waiting");
  }

  
  const publishRes = await axios.post(
    `${FB_BASE}/${igUserId}/media_publish`,
    null,
    {
      params: {
        creation_id: creationId,
        access_token: pageAccessToken,
      },
    }
  );

  return {
    mediaId: publishRes.data.id,
    videoUrl,
  };
};