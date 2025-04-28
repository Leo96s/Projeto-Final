pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Leo96s/Projeto-Final', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Instalar dependências do Node.js
                dir('backend') {
                // Instalar as dependências
                sh 'npm install'
            }
            }
            }

        stage('Test') {
            steps {
                // Executar testes, caso você tenha algum teste configurado
                script {
            // Mudar para o diretório correto
            dir('backend') {
                // Instalar as dependências
                sh 'npm install'
            }
            }
        }
        }

        stage('Deploy to Vercel') {
            steps {
                script {
                git url: 'https://github.com/Leo96s/Projeto-Final', branch: 'main'
                echo 'Deploy realizado automaticamente pelo Render!'
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy realizado com sucesso!'
        }
        failure {
            echo 'Falha no deploy!'
        }
    }
}
