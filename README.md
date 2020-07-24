# Scrooge

## AWS Cost Monitoring Lambda

### Build

```$sam build --template scrooge-template.yml ```

### Deploy

Create S3 bucket and run the command below

```$sam deploy --stack-name scrooge-stack --s3-bucket your-sam-upload-s3-bucket --s3-prefix scrooge --template scrooge-template.yml --region us-east-1 --capabilities CAPABILITY_NAMED_IAM```


DISCLAIMER: This project, code samples and the documentation are provided "as is" without warranty of any kind, either express or implied. Use at your own risk.

We make makes no warranty that

- the software will meet your requirements
- the software will be uninterrupted, timely, secure or error-free
- the results that may be obtained from the use of the software will be effective, accurate or reliable
- the quality of the software will meet your expectations
- any errors in the software obtained from us will be corrected.

We assume no responsibility for errors or omissions in the software or documentation.