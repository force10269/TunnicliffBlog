const express = require('express');
require('dotenv').config({ path: '../.env' });
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const mongoose = require('mongoose');
var router = express.Router();
const { ObjectId } = require('mongodb');
var { Image } = require('../models/image');

const conn = mongoose.createConnection(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let gridfsBucket;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'images'
    });
});

let storage = null;
let uploadImage = null;

storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buff) => {
                if(err){
                    return reject(err);
                }

                const fileName = buff.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: fileName,
                    originalName: file.originalName,
                    bucketName: 'images'
                };

                resolve(fileInfo);
            });
        });
    }
});

uploadImage = multer({
    storage,
    limits: {
        fileSize: 4 * 1024 * 1024, // 4MB
    },
});

router.get('/:id', async (req, res) => {
    try {
      const filesCollection = await mongoose.connection.db.collection('images.files');
      const file = await filesCollection.findOne({_id: new ObjectId(req.params.id)});
      if (!file) {
        res.status(404).json({
          error: "404",
          message: "The resource does not exist, invalid request",
        });
      } else {
        // Make sure that we can accept multiple file types
        res.set({
          "Content-Type": file.contentType
        });
  
        const readStream = gridfsBucket.openDownloadStream(new ObjectId(req.params.id));
        readStream.on('end', () => res.end());
        return readStream.pipe(res);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "500",
        message: "Internal server error",
      });
    }
  });

// Here, we delete a specific image from the database
router.delete('/:id', async (req, res) => {
    try {
        // Get the hashedname for the current ObjectId
        const image = await Image.findOne({ _id: new ObjectId(req.params.id) });
        if (!image) {
            return res.status(404).json({
                error: "404",
                message: "The resource does not exist, invalid request",
            });
        }
        const hashedname = image.hashedname;

        // Delete the hashedname entry in 'images.files'
        const hashedFiles = await gridfsBucket.find({ filename: hashedname }).toArray();
        if (hashedFiles.length > 0) {
            const hashedFile = hashedFiles[0];
            await gridfsBucket.delete(hashedFile._id);
        }

        // Delete the image entry in 'images'
        await Image.findOneAndDelete({ _id: new ObjectId(req.params.id) });
        return res.status(200).json({
            message: "All image entries deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "500",
            message: "Internal server error",
        });
    }
});

// Here is the POST request. We use the uploadImage multer variable for this
router.post('/', uploadImage.single("image"), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const { buffer } = req.file;
        const metadata = {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        };

        const uploadStream = gridfsBucket.openUploadStream(metadata.filename, { metadata });

        uploadStream.once('finish', async () => {
            const image = new Image({
                filename: req.file.originalname,
                hashedname: req.file.filename,
                content_type: req.file.mimetype,
                imageurl: `${process.env.BACKEND_ORIGIN}/images/${req.file.originalname}`
            });

            try{
                const imageSave = await image.save();
                // Find the hashedname entry in 'images.files'
                const hashedFile = await gridfsBucket.find({ filename: req.file.filename }).toArray();
                if (hashedFile.length > 0) {
                    const hashedId = hashedFile[0]._id;
                    return res.status(200).json({ id: hashedId, message: 'Image uploaded successfully' });
                } else {
                    return res.status(500).json({ error: 'Hashedname file entry not found' });
                }
            } catch (err) {
                return res.status(500).json({ error: err });
            }
        });

        uploadStream.end(buffer);

    } catch (err) {
        console.log(err);
    }
});


module.exports = router;