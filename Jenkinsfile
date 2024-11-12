pipeline {
    agent any
    
    tools {
        nodejs "NodeJS 16"
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm // This will pull code from the configured repository
            }
        }

        
        stage('Verify Workspace Structure') {
            steps {
                echo 'Checking workspace structure...'
                sh 'ls -la'
                sh 'ls -la TODO'        
                sh 'ls -la TODO/todo_frontend'  
                sh 'ls -la TODO/todo_backend'   
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('TODO/todo_frontend') {
                    sh 'npm install --verbose'
                }
                dir('TODO/todo_backend') {
                    sh 'npm install --verbose'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('TODO/todo_frontend') {
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        sh 'npm run build --verbose'
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('TODO/todo_backend') {
                    sh 'npm run build'
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
