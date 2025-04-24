pipeline {
    agent any

    environment {
        // Variáveis de ambiente, por exemplo, chave de autenticação do Vercel
        VERCEL_TOKEN = credentials('vercel-token') // Supondo que você tenha configurado a chave de autenticação no Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Leo96s/Projeto-Final', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Instalar dependências do Node.js
                script {
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

        stage('Deploy to Vercel') {
            steps {
                script {
                    // Exemplo de deploy no Vercel usando a CLI do Vercel
                    sh 'vercel --prod --token $VERCEL_TOKEN'
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
