#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import {PipelineStack} from '../lib/pipeline-stack';

const app = new App();
new PipelineStack(app, 'AwsBillingAlertsPipeline', {
  env: {
    region: 'us-east-1',
    account: '645056685795',
  },
});

app.synth();
