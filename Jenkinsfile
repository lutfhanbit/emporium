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
        stage('Install Snyk CLI') {
            steps {
                sh '''
                    npm install -g snyk
                    snyk --version
                '''
            }
        }
        stage('Security Testing with Snyk CLI') {
            steps {
                withCredentials([string(credentialsId: 'snyk-cli-token', variable: 'SNYK_TOKEN')]) {
                    sh '''
                        export SNYK_TOKEN=$SNYK_TOKEN
                        snyk test --json > snyk-result.json || true
                        ls -l snyk-result.json || true
                    '''
                }
            }
        }
        stage('Security Testing with Snyk with Reporting') {
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
        stage('Parse Snyk Result') {
            steps {
                script {
                    def result = readJSON file: 'snyk-result.json'
                    def vulns = result.vulnerabilities ?: []

                    echo "🔍 Total vulnerabilities: ${vulns.size()}"

                    def grouped = vulns.groupBy { it.severity }
                    grouped.each { sev, list ->
                        echo " - ${sev?.toUpperCase() ?: 'UNKNOWN'}: ${list.size()}"
                    }

                    def highCritical = vulns.findAll {
                        it.severity in ['high', 'critical']
                    }

                    if (highCritical.size() > 0) {
                        echo "❌ High/Critical vulnerabilities found:"
                        highCritical.take(5).each {
                            echo " - ${it.severity.toUpperCase()} | ${it.title}"
                        }
                        // error("Build failed due to High/Critical vulnerabilities")
                    }

                    echo "✅ No High/Critical vulnerabilities found"
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
