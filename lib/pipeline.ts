import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'AwsBillingAlerts', {
      pipelineName: 'AwsBillingAlerts',
      synth: new ShellStep('synth', {
        input: CodePipelineSource.gitHub(
          'sourabh-pisal/aws-billing-alerts-cdk',
          'main'
        ),
        commands: ['npm ci', 'npm run build'],
      }),
    });

    Tags.of(pipeline).add('project', 'billing');
  }
}
