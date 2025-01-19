const AWS = require('aws-sdk')


const uploadToS3=(data, filename) =>{
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;//s3/bucket
    const ACCESS_KEY = process.env.AWS_ACCESS_KEY;//s3 / security-credentials top-right
    const SECRET_KEY = process.env.AWS_SECRET_KEY;
    let s3bucket = new AWS.S3({//Initialize the s3 bucket so it has all permissions
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,

    })
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL:'public-read'//it makes the file publicly readable
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params, (err, s3response) => {
                if (err) {
                    console.log("Something went wrong", err);
                    reject(err);
                }
                else {
                    console.log("success", s3response)
                    resolve( s3response.Location)
                }
            });


        })
    


}

module.exports={
    uploadToS3
}