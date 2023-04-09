import {Stack, StackProps} from 'aws-cdk-lib';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import {Construct} from 'constructs';
import {PipelineStage} from './pipeline-stage';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'AwsBillingAlertsPipeline', {
      pipelineName: 'AwsBillingAlertsPipeline',
      synth: new ShellStep('synth', {
        input: CodePipelineSource.gitHub(
          'sourabh-pisal/aws-billing-alerts-cdk',
          'main'
        ),
        commands: ['npm ci', 'npm run build'],
      }),
    });

    pipeline.addStage(
      new PipelineStage(this, 'prod', {
        env: {
          region: 'us-east-1',
        },
      })
    );
  }
}
