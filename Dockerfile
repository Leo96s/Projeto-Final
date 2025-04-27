FROM jenkins/jenkins:lts-jdk17

USER root

# Atualizar e instalar dependências
RUN apt-get update && apt-get install -y \
  lsb-release curl gnupg2

# Instalar Docker CLI
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli

# Instalar Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Cria diretórios necessários e ajusta permissões
RUN mkdir -p /var/jenkins_home/jobs/my-pipeline-job && \
    mkdir -p /var/jenkins_home/plugins && \
    chown -R jenkins:jenkins /var/jenkins_home

# Copiar configuração do Jenkins Configuration as Code
COPY jenkins.yaml /var/jenkins_home/casc_configs/jenkins.yaml

# Copiar job específico
COPY config.xml /var/jenkins_home/jobs/my-pipeline-job/config.xml

# Copiar lista de plugins a instalar
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

# Instalar plugins no build
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Voltar ao utilizador jenkins
USER jenkins

# Definir diretório de trabalho
WORKDIR /var/jenkins_home

# Definir variáveis de ambiente
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false -Djenkins.CLI.disabled=true"
ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc_configs/jenkins.yaml

