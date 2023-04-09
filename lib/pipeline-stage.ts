import {StackProps, Stage} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {AwsBillingAlertsStack} from './aws-billing-alerts-stack';

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new AwsBillingAlertsStack(this, 'AwsBillingAlerts', props);
  }
}
