const fs = require('fs');
const AWS = require('aws-sdk');
const formidable = require('formidable');

const credentials = new AWS.SharedIniFileCredentials({ profile: 'recyglo' });
AWS.config.credentials = credentials;

AWS.config.update({
  region: 'ap-southeast-1',
});
AWS.config.apiVersions = {
  s3: '2006-03-01',
};

const GREET = async (req, res) => res.status(200).send('Welcome to Recyglo API');

const UPLOAD_TO_S3 = async (req, res) => {
  // console.log(Object.keys(req));
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    // console.log(files);
    // console.log(fields);
    if (!files.files) {
      return res.status(500).send('Please upload file in form-data.');
    }
    const file = files.files;
    fs.readFile(file.path, (err, data) => {
      if (err) throw err; // Something went wrong!
      const s3bucket = new AWS.S3({ params: { Bucket: 'recyglo-b2b' } });
      let ext = file.name.split('.');
      ext = ext[ext.length - 1];
      const filename = `${Number(new Date())}.${ext}`;
      s3bucket.createBucket(() => {
        const params = {
          Key: filename,
          Body: data,
          ACL: 'public-read',
        };
        s3bucket.upload(params, (error, data) => {
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error(err);
            }
          });
          if (err) {
            // console.log('ERROR MSG: ', error);
            return res.status(500).send(error);
          }
          return res.status(200).send({
            file: data.Location,
            message: 'Successfully uploaded data',
          });
        });
      });
    });
  });
};

module.exports = {
  GREET,
  UPLOAD_TO_S3,
};
