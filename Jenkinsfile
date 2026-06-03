pipeline {
  agent any

  tools {
    nodejs 'NodeJS-22'
  }

  environment {
    AWS_REGION   = 'ap-south-1'
    S3_BUCKET    = 'threetierfrontend'
    EB_APP       = 'three-tier-app'
    EB_ENV       = 'threetierapp-env'
    CF_DIST_ID   = 'YOUR_CLOUDFRONT_ID'
  }

  stages {

    stage('1 - Checkout Code') {
      steps {
        echo 'Pulling latest code from GitHub...'
        checkout scm
      }
    }

    stage('2 - Install Frontend') {
      steps {
        echo 'Installing React dependencies...'
        dir('frontend') {
          sh 'npm ci'
        }
      }
    }

    stage('3 - Build Frontend') {
      steps {
        echo 'Building React app...'
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('4 - Deploy Frontend to S3') {
      steps {
        echo 'Uploading React build to S3...'
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'aws-credentials'
        ]]) {
          sh '''
            aws s3 sync frontend/build/ s3://${S3_BUCKET} \
              --region ${AWS_REGION} \
              --delete
          '''
        }
      }
    }

    stage('5 - Invalidate CloudFront Cache') {
      steps {
        echo 'Clearing CloudFront CDN cache...'
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'aws-credentials'
        ]]) {
          sh '''
            aws cloudfront create-invalidation \
              --distribution-id ${CF_DIST_ID} \
              --paths "/*"
          '''
        }
      }
    }

    stage('6 - Package Backend') {
      steps {
        echo 'Creating backend ZIP for Beanstalk...'
        sh '''
          cd backend
          zip -r ../app-${BUILD_NUMBER}.zip . \
            --exclude "node_modules/*" \
            --exclude ".git*" \
            --exclude ".env"
        '''
      }
    }

    stage('7 - Upload Backend to S3') {
      steps {
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'aws-credentials'
        ]]) {
          sh '''
            aws s3 cp app-${BUILD_NUMBER}.zip \
              s3://${S3_BUCKET}/deployments/app-${BUILD_NUMBER}.zip \
              --region ${AWS_REGION}
          '''
        }
      }
    }

    stage('8 - Deploy Backend to Beanstalk') {
      steps {
        echo 'Deploying Node.js API to Elastic Beanstalk...'
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'aws-credentials'
        ]]) {
          sh '''
            aws elasticbeanstalk create-application-version \
              --application-name ${EB_APP} \
              --version-label v-${BUILD_NUMBER} \
              --source-bundle S3Bucket=${S3_BUCKET},S3Key=deployments/app-${BUILD_NUMBER}.zip \
              --region ${AWS_REGION}

            aws elasticbeanstalk update-environment \
              --application-name ${EB_APP} \
              --environment-name ${EB_ENV} \
              --version-label v-${BUILD_NUMBER} \
              --region ${AWS_REGION}
          '''
        }
      }
    }

    stage('9 - Verify Deployment') {
      steps {
        echo 'Checking if app is healthy...'
        sh '''
          sleep 30
          curl -f http://d29tkwjze0pcvw.cloudfront.net/health \
            && echo "App is UP!" \
            || echo "Health check failed"
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline SUCCESS — App deployed to AWS!'
    }
    failure {
      echo '❌ Pipeline FAILED — Check the logs above'
    }
    always {
      echo 'Pipeline finished. Build: ${BUILD_NUMBER}'
    }
  }
}