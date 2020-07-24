# Scrooge

## AWS Cost Monitoring Lambda

This Lambda makes it possible to monitor your daily AWS cost in case you have a positive AWS credits balance. A CloudWatch EstimatedCharges metric currently (summer of 2020) available out of the box provides estimated expense after credits have been applied. We use AWS Cost Explorer to pull metrics available using Daily Granularity day and to publish them as CloutWatch metrics. These metrics can be used to create alarms.

Note, that use of Cost Explorer API is not free: https://aws.amazon.com/aws-cost-management/pricing/. We assume no responsibility for any charges that can arise from using this lambda or any loss you may incurr.

You need to enable IAM access to billing in order to be able to use this AWS lambda: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/control-access-billing.html

If you use the default configuration, there will be two metrics published in AWS CloudWatch in ScroogeSpace space: 

- ScroogeNetAmortizedCost
- ScroogeUnblendedCost

Valid values for Cost Explorer Metrics are:

- AmortizedCost
- BlendedCost
- NetAmortizedCost
- NetUnblendedCost
- NormalizedUsageAmount
- UnblendedCost
- UsageQuantity

Please check AWS documentation for details: https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html

### Build

```$sam build --template scrooge-template.yml ```

### Deploy

Create S3 bucket and run the command below

```$sam deploy --stack-name scrooge-stack --s3-bucket your-sam-upload-s3-bucket --s3-prefix scrooge --template scrooge-template.yml --region us-east-1 --capabilities CAPABILITY_NAMED_IAM  --parameter-overrides ParameterKey=CEMetrics,ParameterValue='{\"NetAmortizedCost\":\"ScroogeNetAmortizedCost\"}' ParameterKey=HeartBeatRateMins,ParameterValue=15```


DISCLAIMER: This project, code samples and the documentation are provided "as is" without warranty of any kind, either express or implied. Use at your own risk.

We make makes no warranty that

- the software will meet your requirements
- the software will be uninterrupted, timely, secure or error-free
- the results that may be obtained from the use of the software will be effective, accurate or reliable
- the quality of the software will meet your expectations
- any errors in the software obtained from us will be corrected.

We assume no responsibility for errors or omissions in the software or documentation.