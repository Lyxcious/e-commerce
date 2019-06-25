const gcsHelpers = require('../helpers/google-cloud-storage');
const {
  Storage
} = require('@google-cloud/storage');
const mimeTypes = require('mimetypes');

const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = process.env.GOOGLE_CLOUD_KEYFILE; // Replace with the path to the downloaded private key

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});
let DEFAULT_BUCKET_NAME // Replace with the name of your bucket
if (process.env.NODE_ENV === 'test') {
  DEFAULT_BUCKET_NAME = process.env.TEST_BUCKET_NAME
} else {
  DEFAULT_BUCKET_NAME = process.env.DEFAULT_BUCKET_NAME
}

/**
 * Middleware for uploading file to GCS.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */

exports.sendUploadToGCS = (req, res, next) => {
  let regex_check_base64 = /^data:(.*;base64,)?/
  if (req.body.image) {
    if (regex_check_base64.test(req.body.image)) {
      let mimeType = req.body.image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]
      let fileName = req.body.name + mimeTypes.detectExtension(mimeType)
      let base64EncodedImageString = req.body.image.replace(/^data:image\/\w+;base64,/, '')
      let imageBuffer = new Buffer(base64EncodedImageString, 'base64')

      const bucketName = req.body.bucketName || DEFAULT_BUCKET_NAME;
      const bucket = storage.bucket(bucketName);
      const gcsFileName = `${Date.now()}-${fileName}`;
      const file = bucket.file(gcsFileName);

      file.save(imageBuffer, {
        metadata: {
          contentType: mimeType
        },
        validation: 'md5'
      }, function (error) {

        if (error) {
          next(error);
        }

        file.makePublic()
          .then(() => {
            req.body.image = gcsHelpers.getPublicUrl(bucketName, gcsFileName);
            console.log(req.body.image)
            next();
          });
      });
    } else {
      next()
    }
  } else {
    next()
  }
};