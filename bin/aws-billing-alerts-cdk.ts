#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { AwsBillingAlertsCdkStack } from "../lib/aws-billing-alerts-cdk-stack";

const app = new App();
new AwsBillingAlertsCdkStack(app, "AwsBillingAlertsCdkStack", {
  env: {
    region: "us-east-1",
  },
});
