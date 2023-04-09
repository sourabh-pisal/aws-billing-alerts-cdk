import {CfnParameter, Duration, Stack, StackProps} from 'aws-cdk-lib';
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
import {BILLING_THRESHOLD_IN_USD} from './config';

export class AwsBillingAlertsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const emailAddressParameter = new CfnParameter(this, 'email');

    const biilingAlertstopic = new Topic(this, 'Topic');
    biilingAlertstopic.addSubscription(
      new EmailSubscription(emailAddressParameter.valueAsString)
    );

    const billingMetric = new Metric({
      namespace: 'AWS/Billing',
      metricName: 'EstimatedCharges',
      statistic: 'Maximum',
      dimensionsMap: {Currency: 'USD'},
    });
    const billingAlarm = new Alarm(this, 'Alarm', {
      metric: billingMetric.with({period: Duration.hours(6)}),
      alarmDescription: `Upper Billing Limit of ${BILLING_THRESHOLD_IN_USD}`,
      threshold: BILLING_THRESHOLD_IN_USD,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      evaluationPeriods: 1,
      treatMissingData: TreatMissingData.MISSING,
    });

    const alarmAction = new SnsAction(biilingAlertstopic);
    billingAlarm.addAlarmAction(alarmAction);
  }
}
