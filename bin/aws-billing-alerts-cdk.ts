#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { AwsBillingAlertsCdkStack } from "../lib/aws-billing-alerts-cdk-stack";
import { PipelineStack } from "../lib/pipeline";

const app = new App();
new PipelineStack(app, "AwsBillingAlerts", {
  env: {
    region: "us-east-1",
    account: "645056685795"
  },
})
// new AwsBillingAlertsCdkStack(app, "AwsBillingAlertsCdkStack", {
//   env: {
//     region: "us-east-1",
//     account: "645056685795"
//   },
// });

app.synth();
