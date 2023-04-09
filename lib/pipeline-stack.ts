import {Stack, StackProps} from 'aws-cdk-lib';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import {Construct} from 'constructs';
import {PipelineStage} from './pipeline-stage';
import {Topic} from 'aws-cdk-lib/aws-sns';
import {EmailSubscription} from 'aws-cdk-lib/aws-sns-subscriptions';
import {
  DetailType,
  NotificationRule,
} from 'aws-cdk-lib/aws-codestarnotifications';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const codePipeline = new CodePipeline(this, 'AwsBillingAlertsPipeline', {
      pipelineName: 'AwsBillingAlertsPipeline',
      synth: new ShellStep('synth', {
        input: CodePipelineSource.gitHub(
          'sourabh-pisal/aws-billing-alerts-cdk',
          'main'
        ),
        commands: ['npm ci', 'npm run build'],
      }),
    });

    codePipeline.addStage(
      new PipelineStage(this, 'prod', {
        env: {
          region: 'us-east-1',
        },
      })
    );

    codePipeline.buildPipeline();

    const pipelineTopic = new Topic(this, 'AwsBillingAlertsPipelineTopic');
    pipelineTopic.addSubscription(
      new EmailSubscription('{{resolve:ssm:email}}')
    );

    new NotificationRule(this, 'AwsBillingAlertsPipelineNotification', {
      detailType: DetailType.BASIC,
      events: [
        'codepipeline-pipeline-pipeline-execution-failed',
        'codepipeline-pipeline-pipeline-execution-canceled',
        'codepipeline-pipeline-pipeline-execution-succeeded',
        'codepipeline-pipeline-pipeline-execution-superseded',
      ],
      source: codePipeline.pipeline,
      targets: [pipelineTopic],
    });
  }
}
