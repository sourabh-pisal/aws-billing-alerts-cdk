#!/usr/bin/env node
import {App, Tags} from 'aws-cdk-lib';
import {PipelineStack} from '../lib/pipeline-stack';

const app = new App();
const pipelineStack = new PipelineStack(app, 'AwsBillingAlertsPipeline', {
  env: {
    region: 'us-east-1',
  },
});

Tags.of(pipelineStack).add('project', 'billing');

app.synth();
