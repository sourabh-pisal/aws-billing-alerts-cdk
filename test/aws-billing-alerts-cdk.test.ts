import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as AwsBillingAlertsCdk from "../lib/aws-billing-alerts-cdk-stack";

test("SQS Queue and SNS Topic Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsBillingAlertsCdk.AwsBillingAlertsCdkStack(
    app,
    "MyTestStack"
  );
  // THEN

  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::SNS::Topic", {});

  template.hasResourceProperties("AWS::SNS::Subscription", {
    Protocol: "email",
  });

  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ComparisonOperator: "GreaterThanThreshold",
    EvaluationPeriods: 1,
    AlarmDescription: "Upper Billing Limit of 4",
    Dimensions: [
      {
        Name: "Currency",
        Value: "USD",
      },
    ],
    MetricName: "EstimatedCharges",
    Namespace: "AWS/Billing",
    Period: 21600,
    Statistic: "Maximum",
    Threshold: 4,
    TreatMissingData: "missing",
  });
});
