FROM jenkins/jenkins:lts-jdk17

USER root

# Actualizar e instalar dependências
RUN apt-get update && apt-get install -y lsb-release curl gnupg2

# Instalar Docker CLI
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli

# Instalar Node.js (para CLI do Vercel)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Copiar plugins.txt e instalar plugins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Copiar configuração inicial
COPY config.xml /usr/share/jenkins/ref/jobs/my-pipeline-job/config.xml
COPY jenkins.yaml /usr/share/jenkins/ref/jenkins.yaml

# Definir permissões corretas
RUN mkdir -p /var/jenkins_home && chown -R jenkins:jenkins /var/jenkins_home /usr/share/jenkins/ref

USER jenkins

# Definir o directório de trabalho
WORKDIR /var/jenkins_home

# Evitar o setup inicial do Jenkins
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"


