const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

const COMPRESSION_QUALITY = 80;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const AVATAR_MAX_WIDTH = 400;
const AVATAR_MAX_HEIGHT = 400;

/**
 * Compress and optimize images after upload
 * Converts to WebP with JPEG fallback, max 1200x1200px
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 * @param {Function} next - Express next middleware
 */
const compressImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const compressedFiles = [];

    for (const file of req.files) {
      try {
        const originalPath = file.path;
        const fileNameWithoutExt = path.basename(file.filename, path.extname(file.filename));
        const uploadsDir = path.dirname(originalPath);
        const originalExt = path.extname(file.filename).toLowerCase();

        // If file is already WebP, just resize if needed and create JPEG fallback
        if (originalExt === '.webp') {
          // Create resized WebP version
          const webpPath = path.join(uploadsDir, `${fileNameWithoutExt}_processed.webp`);
          await sharp(originalPath)
            .resize(MAX_WIDTH, MAX_HEIGHT, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({ quality: COMPRESSION_QUALITY })
            .toFile(webpPath);

          // Create JPEG fallback version
          const jpegPath = path.join(uploadsDir, `${fileNameWithoutExt}.jpg`);
          await sharp(originalPath)
            .resize(MAX_WIDTH, MAX_HEIGHT, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .jpeg({ quality: COMPRESSION_QUALITY, progressive: true })
            .toFile(jpegPath);

          // Delete original and rename processed
          await fs.unlink(originalPath);
          const finalWebpPath = path.join(uploadsDir, `${fileNameWithoutExt}.webp`);
          await fs.rename(webpPath, finalWebpPath);

          file.path = finalWebpPath;
          file.filename = `${fileNameWithoutExt}.webp`;
          file.mimetype = 'image/webp';
          file.fallbackPath = jpegPath;
          file.fallbackFilename = `${fileNameWithoutExt}.jpg`;

          compressedFiles.push(file);
          logger.info(`✅ WebP image processed: ${file.originalname} → ${fileNameWithoutExt}.webp + .jpg`);
          continue;
        }

        // Create WebP version
        const webpPath = path.join(uploadsDir, `${fileNameWithoutExt}.webp`);
        await sharp(originalPath)
          .resize(MAX_WIDTH, MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: COMPRESSION_QUALITY })
          .toFile(webpPath);

        // Create JPEG fallback version
        const jpegPath = path.join(uploadsDir, `${fileNameWithoutExt}.jpg`);
        await sharp(originalPath)
          .resize(MAX_WIDTH, MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: COMPRESSION_QUALITY, progressive: true })
          .toFile(jpegPath);

        // Delete original file
        await fs.unlink(originalPath);

        // Update file object with WebP as primary, JPEG as fallback
        file.path = webpPath;
        file.filename = `${fileNameWithoutExt}.webp`;
        file.mimetype = 'image/webp';
        file.fallbackPath = jpegPath;
        file.fallbackFilename = `${fileNameWithoutExt}.jpg`;

        compressedFiles.push(file);

        logger.info(`✅ Image compressed: ${file.originalname} → ${fileNameWithoutExt}.webp + .jpg`);
      } catch (err) {
        logger.error(`❌ Error compressing image ${file.originalname}:`, err.message);
        // If compression fails, keep the original file
        compressedFiles.push(file);
        logger.warn(`⚠️ Keeping original file: ${file.originalname}`);
      }
    }

    req.files = compressedFiles;
    next();
  } catch (err) {
    logger.error('Image compression middleware error:', err);
    next(err);
  }
};

/**
 * Compress avatar image after upload
 * Converts to WebP with JPEG fallback, max 400x400px
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 * @param {Function} next - Express next middleware
 */
const compressAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const file = req.file;
    const originalPath = file.path;
    const fileNameWithoutExt = path.basename(file.filename, path.extname(file.filename));
    const uploadsDir = path.dirname(originalPath);

    try {
      // Create WebP version
      const webpPath = path.join(uploadsDir, `${fileNameWithoutExt}.webp`);
      await sharp(originalPath)
        .resize(AVATAR_MAX_WIDTH, AVATAR_MAX_HEIGHT, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: COMPRESSION_QUALITY })
        .toFile(webpPath);

      // Create JPEG fallback version
      const jpegPath = path.join(uploadsDir, `${fileNameWithoutExt}.jpg`);
      await sharp(originalPath)
        .resize(AVATAR_MAX_WIDTH, AVATAR_MAX_HEIGHT, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: COMPRESSION_QUALITY, progressive: true })
        .toFile(jpegPath);

      // Delete original file
      await fs.unlink(originalPath);

      // Update file object with WebP as primary, JPEG as fallback
      file.path = webpPath;
      file.filename = `${fileNameWithoutExt}.webp`;
      file.mimetype = 'image/webp';
      file.fallbackPath = jpegPath;
      file.fallbackFilename = `${fileNameWithoutExt}.jpg`;

      logger.info(`✅ Avatar compressed: ${file.originalname} → ${fileNameWithoutExt}.webp + .jpg`);
      next();
    } catch (err) {
      logger.error(`❌ Error compressing avatar ${file.originalname}:`, err.message);
      next(err);
    }
  } catch (err) {
    logger.error('Avatar compression middleware error:', err);
    next(err);
  }
};

module.exports = { compressImages, compressAvatar };
