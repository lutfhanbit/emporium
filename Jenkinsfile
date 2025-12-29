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
                    monitorProjectOnBuild: true
                )
            }
        }
        stage('Snyk Security Summary') {
            steps {
                script {
                    echo '📊 Fetching Snyk vulnerability summary...'
                    def snykResult = sh(
                        script: '''
                            snyk test --json 2>&1 || true
                        ''',
                        returnStdout: true
                    ).trim()
                    
                    try {
                        def jsonResult = readJSON text: snykResult
                        def critical = jsonResult.uniqueCount?.critical ?: 0
                        def high = jsonResult.uniqueCount?.high ?: 0
                        def medium = jsonResult.uniqueCount?.medium ?: 0
                        def low = jsonResult.uniqueCount?.low ?: 0
                        
                        echo '═══════════════════════════════════════'
                        echo '🔍 SNYK SECURITY SCAN SUMMARY'
                        echo '═══════════════════════════════════════'
                        echo "Critical severity: ${critical}"
                        echo "High severity: ${high}"
                        echo "Medium severity: ${medium}"
                        echo "Low severity: ${low}"
                        echo '═══════════════════════════════════════'
                        
                        // Get project URL if available
                        if (jsonResult.projectUrl) {
                            echo "URL Report: ${jsonResult.projectUrl}"
                        } else {
                            echo "URL Report: Check Snyk dashboard at https://app.snyk.io"
                        }
                        echo '═══════════════════════════════════════'
                    } catch (Exception e) {
                        echo "⚠️ Could not parse Snyk results: ${e.message}"
                        echo "Raw output: ${snykResult}"
                    }
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
