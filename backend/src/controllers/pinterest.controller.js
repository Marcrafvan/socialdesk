const pinterestService = require("../services/pinterest.service");

exports.redirectToPinterest = (req, res) => {
  const url = pinterestService.getPinterestAuthUrl();
  res.redirect(url);
};

exports.handlePinterestCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code missing",
      });
    }

    const tokenData = await pinterestService.handlePinterestOAuth(code);

    res.json({
      success: true,
      token: tokenData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};

exports.createPinterestBoard = async (req, res) => {
  console.log("HIT");
  try {
    const { accessToken, name, description } = req.body;

    if (!accessToken || !name) {
      return res.status(400).json({
        error: "accessToken and name are required",
      });
    }

    const board = await pinterestService.createPinterestBoard({
      accessToken,
      name,
      description,
    });

    res.json({
      success: true,
      board,
    });
  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};

exports.createPin = async (req, res) => {
  try {
    const file = req.file;

    const {
      accessToken,
      boardId,
      title,
      description,
      link,
    } = req.body || {}; 

    if (!accessToken || !boardId) {
      return res.status(400).json({
        error: "accessToken and boardId are required",
      });
    }

    const result = await pinterestService.createPinterestPin({
      accessToken,
      boardId,
      title,
      description,
      link,
      file,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};