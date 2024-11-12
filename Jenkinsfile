pipeline {
    agent any
    
    tools {
        nodejs "NodeJS 16"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Verify Directory Structure') {
            steps {
                // Log the directory structure for debugging
                echo 'Checking workspace structure...'
                sh 'ls -la'
                sh 'ls -la ./TODO/todo_frontend'
                sh 'cat ./TODO/todo_frontend/package.json' // Show package.json content for confirmation
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('./TODO/todo_frontend') {
                    sh 'npm install --verbose'
                }
                dir('./TODO/todo_backend') {
                    sh 'npm install --verbose'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend...'
                dir('./TODO/todo_frontend') {
                    // Run npm run build
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        sh 'npm run build --verbose'
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('./TODO/todo_backend') {
                    sh 'npm test'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
        always {
            cleanWs()
        }
    }
}
