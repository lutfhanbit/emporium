pipeline {
    // agent {
    //     dockerContainer { image 'node:24-alpine' }
    // }
    agent any    

    tools {
        nodejs 'angular'
    }

    environment {
        BUILD_DIR   = 'dist/browser'     // Output folder after Angular build
        DEPLOY_DIR  = 'app/html'          // Target directory for deployment
        DOCKER_IMAGE = 'lutfhanbit/emporium'
        DOCKER_TAG   = "${BUILD_NUMBER}"
    }

    stages {

        stage('Install jq') {
            steps {
                sh '''
                    if command -v jq >/dev/null 2>&1; then
                        echo "✅ jq already installed"
                        jq --version
                    else
                        echo "📦 Installing jq..."
                        sudo apt-get update -y
                        sudo apt-get install -y jq
                        jq --version
                    fi
                '''
            }
        }

        stage('Verify Node.js and npm') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'ng version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm i'
            }
        }

        stage('Security Testing with Snyk') {
            steps {
                echo 'Running Snyk security scan...'
                snykSecurity(
                    snykInstallation: 'snyk@latest',
                    snykTokenId: 'snyk-api-token',
                    failOnIssues: false,
                    monitorProjectOnBuild: true
                )
            }
        }

        stage('Print Snyk Severity Summary') {
            steps {
                sh '''
                    echo "📊 Collecting Snyk severity summary..."

                    # Cari file report JSON dari Snyk Plugin
                    SNYK_JSON=$(ls *_snyk_report.json 2>/dev/null | head -n 1)

                    if [ -z "$SNYK_JSON" ]; then
                        echo "❌ Snyk JSON report not found"
                        exit 0
                    fi

                    CRITICAL=$(jq '[.vulnerabilities[] | select(.severity=="critical")] | length' "$SNYK_JSON")
                    HIGH=$(jq '[.vulnerabilities[] | select(.severity=="high")] | length' "$SNYK_JSON")
                    MEDIUM=$(jq '[.vulnerabilities[] | select(.severity=="medium")] | length' "$SNYK_JSON")
                    LOW=$(jq '[.vulnerabilities[] | select(.severity=="low")] | length' "$SNYK_JSON")

                    PROJECT_URL=$(jq -r '.uri // empty' "$SNYK_JSON")

                    echo "=============================="
                    echo "🔐 SNYK SECURITY SUMMARY"
                    echo "Critical severity : $CRITICAL"
                    echo "High severity     : $HIGH"
                    echo "Medium severity   : $MEDIUM"
                    echo "Low severity      : $LOW"
                    echo "------------------------------"
                    echo "URL : $PROJECT_URL"
                    echo "=============================="
                '''
            }
        }

        stage('Build Angular App') {
            steps {
                sh 'ng build --configuration=production'
            }
        }

        stage('Copy App Build') {
            steps {
                script {
                    if (fileExists(BUILD_DIR)) {
                        echo "🚀 Deploying build to ${DEPLOY_DIR}..."
                        sh "rm -rf ${DEPLOY_DIR} || true"
                        sh "mkdir -p ${DEPLOY_DIR}"
                        sh "cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/"
                        echo '✅ Deployment complete.'
                    } else {
                        error "❌ Build directory not found: ${BUILD_DIR}"
                    }
                }
            }
        }

        stage('Build & Push Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-lutfhanbit',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            sh "docker logout || true"
        }
        success {
            echo '✅ Build and Deployment Successful!'
        }
        failure {
            echo '❌ Build Failed!'
        }
    }
}
