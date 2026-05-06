const facebookService = require("../services/meta.service");
const cloudinary = require("../config/cloudinary");
const axios = require("axios");
const GRAPH_URL = "https://graph.facebook.com/v25.0";

exports.redirectToFacebook = (req, res) => {
  const url = facebookService.getAuthUrl();
  res.redirect(url);
};

exports.handleFacebookCallback = async (req, res) => {
  try {
    const code = req.query.code;

    const data = await facebookService.handleOAuth(code);

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};


exports.postMessage = async (req, res) => {
  try {
    const { pageId, pageAccessToken, message, scheduledTime } = req.body;

    if (!pageId || !pageAccessToken || !message)
      return res.status(400).json({ success: false, message: "Missing parameters" });

    const result = await facebookService.postToPage({ pageId, pageAccessToken, message, scheduledTime });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("POST ERROR:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};


const FormData = require("form-data");

exports.postPhoto = async (req, res) => {
  try {
    const { pageId, pageAccessToken, caption } = req.body;
    const file = req.file; // multer parses the file

    console.log("req.body:", req.body);
    console.log("this is the page id:", pageId);

    if (!pageId || !pageAccessToken || !file) {
      return res.status(400).json({ success: false, message: "Missing pageId, token, or file" });
    }

    // prepare form-data
    const form = new FormData();
    form.append("source", file.buffer, { filename: file.originalname });
    if (caption) form.append("caption", caption);

    const response = await axios.post(
      `https://graph.facebook.com/v25.0/${pageId}/photos`,
      form,
      {
        headers: { ...form.getHeaders() },
        params: { access_token: pageAccessToken },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("POST PHOTO ERROR:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};


exports.schedulePhotoPost = async (req, res) => {
  try {
    const { pageId, pageAccessToken, message, scheduledTime } = req.body;
    const file = req.file;

    if (!file || !pageId || !pageAccessToken || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
      console.log("Cloudinary config:", cloudinary.config()); 
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "fb_posts" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    const imageUrl = uploadResult.secure_url;
  

    
    const fbResponse = await axios.post(
      `https://graph.facebook.com/v25.0/${pageId}/feed`,
      {
        message,
        link: imageUrl, 
        published: false,
        scheduled_publish_time: scheduledTime,
      },
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );

    res.json({
      success: true,
      imageUrl,
      facebook: fbResponse.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

exports.createInstagramPost = async (req, res) => {
  try {
    const { igUserId, pageAccessToken, caption } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    if (!igUserId || !pageAccessToken) {
      return res.status(400).json({
        error: "igUserId and pageAccessToken are required",
      });
    }

    const result = await facebookService.createInstagramPost({
      igUserId,
      pageAccessToken,
      caption,
      file,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
};

exports.createInstagramReelPost = async (req, res) => {
  console.log("🔥 REEL CONTROLLER HIT");
  try {
    const { igUserId, pageAccessToken, caption } = req.body;
    const file = req.file;

    console.log("MIME TYPE:", req.file.mimetype);
    console.log("FILE:", req.file);

    // 🔒 Validate inputs
    if (!file) {
      return res.status(400).json({
        error: "Video file is required",
      });
    }

    if (!igUserId || !pageAccessToken) {
      return res.status(400).json({
        error: "igUserId and pageAccessToken are required",
      });
    }

    
    const result = await facebookService.createInstagramReelPost({
      igUserId,
      pageAccessToken,
      caption,
      file,
    });

    return res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
};