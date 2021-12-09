const AWS = require('aws-sdk');

const costExplorer = new AWS.CostExplorer({ region: 'us-east-1' });
const cloudWatch = new AWS.CloudWatch({ region: 'us-east-1' });

const { METRICS, CLOUDWATCH_NAMESPACE } = process.env;
const metrics = METRICS && JSON.parse(METRICS) || { 'NetAmortizedCost': 'ScroogeNetAmortizedCost' };
const cwNamespace = CLOUDWATCH_NAMESPACE || 'ScroogeSpace';

const ceMetrics = Object.keys(metrics);

exports.heartbeatHandler = async (event, context) => {
    try {

        const start = new Date();
        start.setDate(start.getDate() - 1);
        const end = new Date();

        const ceParams = {
            Filter: {
                Not: {
                    Dimensions: { 
                        Key: 'RECORD_TYPE', 
                        Values: [ 'Credit' ]
                    }
                }
            },
            TimePeriod: {
                Start: start.toISOString().slice(0, 10),
                End: end.toISOString().slice(0, 10)
            },
            Granularity: 'DAILY',
            Metrics: ceMetrics
        };

        console.log('heartbeatHandler', JSON.stringify({ metrics, cwNamespace }), 'ceParams', JSON.stringify(ceParams));

        const result = await costExplorer.getCostAndUsage(ceParams).promise();

        const totals = result.ResultsByTime && result.ResultsByTime.map(
            ({ Total }) => {
                const result = {};
                ceMetrics.forEach(
                    (name) => result[name] = Total && Total[name] && Total[name].Amount || '0'
                );
                return result;
            }
        ).reduce( // in the future we may want to use TimePeriod greater than one day
            (prev, curr) => {
                const result = {};
                ceMetrics.forEach(
                    (name) => {
                        const currVal = curr && Math.max(parseFloat(curr[name]), 0) || 0;
                        const prevVal = prev[name] || 0;
                        result[name] = currVal + prevVal;
                    });
                return result;
            },
            {}
        );

        console.log('heartbeatHandler.totals', totals);

        const params = {
            MetricData: Object.entries(totals).map(
                ([name, amount]) => ({
                    MetricName: metrics[name],
                    Timestamp: new Date(),
                    Unit: 'None',
                    Value: amount
                })
            ),
            Namespace: cwNamespace
        };

        const cloudwatchresult = await cloudWatch.putMetricData(params).promise();
    } catch (err) {
        console.error('heartbeatHandler', err);
    }
}
