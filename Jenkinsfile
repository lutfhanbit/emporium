pipeline {
    // agent {
    //     dockerContainer { image 'node:24-alpine' }
    // } 
    agent any    
    tools {
        nodejs 'angular'
    }
    environment {
        BUILD_DIR = 'dist/browser'  // Output folder after Angular build
        DEPLOY_DIR = 'app/html' // Target directory for deployment
        DOCKER_IMAGE = 'lutfhanbit/emporium'
        DOCKER_TAG   = "${BUILD_NUMBER}"
        // DOCKER_TAG   = '13'
    }
    stages {
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
                    monitorProjectOnBuild: true,
                    additionalArguments: '--json-file-output=snyk-report.json'
                )
            }
        }
        stage('Security Report Summary') {
            steps {
                script {
                    echo '📊 Generating Security Report Summary...'
                    sh '''
                        if [ -f snyk-report.json ]; then
                            echo "============================================"
                            echo "       SNYK SECURITY SCAN SUMMARY"
                            echo "============================================"
                            
                            # Count vulnerabilities by severity
                            CRITICAL=$(grep -o '"severity":"critical"' snyk-report.json | wc -l || echo 0)
                            HIGH=$(grep -o '"severity":"high"' snyk-report.json | wc -l || echo 0)
                            MEDIUM=$(grep -o '"severity":"medium"' snyk-report.json | wc -l || echo 0)
                            LOW=$(grep -o '"severity":"low"' snyk-report.json | wc -l || echo 0)
                            
                            echo ""
                            echo "🔴 Critical: $CRITICAL"
                            echo "🟠 High:     $HIGH"
                            echo "🟡 Medium:   $MEDIUM"
                            echo "🟢 Low:      $LOW"
                            echo ""
                            echo "Total Vulnerabilities: $((CRITICAL + HIGH + MEDIUM + LOW))"
                            echo "============================================"
                        else
                            echo "⚠️  Snyk report file not found"
                        fi
                    '''
                }
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
                        // Ignore errors if DEPLOY_DIR does not exist
                        sh "rm -rf ${DEPLOY_DIR} || true"

                        // Create the deployment directory
                        sh "mkdir -p ${DEPLOY_DIR}"

                        // Copy build artifacts
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
                    sh """
                      docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                      echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                      docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
    } // end of stages
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
