import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from 'aws-cdk-lib/aws-cloudwatch';
import {SnsAction} from 'aws-cdk-lib/aws-cloudwatch-actions';
import {Topic} from 'aws-cdk-lib/aws-sns';
import {EmailSubscription} from 'aws-cdk-lib/aws-sns-subscriptions';
import {Construct} from 'constructs';

export class AwsBillingAlertsStack extends Stack {
  private static readonly billingThresholdInUsd = 20;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const biilingAlertstopic = new Topic(this, 'AwsBillingAlertsCdkTopic');
    biilingAlertstopic.addSubscription(
      new EmailSubscription('{{resolve:ssm:email}}')
    );

    const billingMetric = new Metric({
      namespace: 'AWS/Billing',
      metricName: 'EstimatedCharges',
      statistic: 'Maximum',
      dimensionsMap: {Currency: 'USD'},
    });
    const billingAlarm = new Alarm(this, 'AwsBillingAlertsCdkAlarm', {
      metric: billingMetric.with({period: Duration.hours(6)}),
      alarmDescription: `Upper Billing Limit of ${AwsBillingAlertsStack.billingThresholdInUsd}`,
      threshold: AwsBillingAlertsStack.billingThresholdInUsd,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      evaluationPeriods: 1,
      treatMissingData: TreatMissingData.MISSING,
    });

    const alarmAction = new SnsAction(biilingAlertstopic);
    billingAlarm.addAlarmAction(alarmAction);
  }
}
