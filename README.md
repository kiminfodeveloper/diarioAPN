# 📝 Diário APN - Sistema de Controle de Protocolos

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/kiminfodeveloper/diarioAPN)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production-ready-brightgreen.svg)](https://github.com/kiminfodeveloper/diarioAPN)

> Sistema profissional para controle e acompanhamento de protocolos APN com armazenamento local e interface moderna.

## 🎯 Sobre o Projeto

O **Diário APN** é um sistema web desenvolvido para gestão profissional de protocolos e registros de atendimento. Focado em segurança e privacidade, todos os dados são armazenados localmente no dispositivo do usuário, garantindo máxima proteção de informações sensíveis.

### ✨ Características Principais

-   🔒 **100% Seguro**: Dados armazenados apenas localmente
-   💼 **Uso Profissional**: Interface corporativa e funcional
-   📊 **Estatísticas Visuais**: Gráficos e relatórios detalhados
-   🔄 **CRUD Completo**: Criar, visualizar, editar e excluir registros
-   📤 **Exportação Múltipla**: TXT, CSV e JSON
-   📥 **Importação de Dados**: Suporte a arquivos JSON e CSV
-   🔐 **Sistema de Login**: Acesso restrito para importação
-   💬 **Sistema de Feedback**: Comunicação direta com suporte
-   🍪 **Cookie Consent**: Conformidade com LGPD
-   📱 **Responsivo**: Funciona em desktop e mobile

## 🚀 Funcionalidades

### 📋 Registro de Protocolos

-   Formulário completo para cadastro de protocolos
-   Validação de dados obrigatórios
-   Sistema de confirmação PID
-   Numeração automática de registros

### 👁️ Visualização e Gestão

-   Lista completa de registros
-   Filtros por status (Resolvido, BKO, Supervisão)
-   Edição individual de registros
-   Exclusão com confirmação
-   Estatísticas em tempo real

### 📊 Análise de Dados

-   Gráfico de pizza interativo
-   Estatísticas por status
-   Exportação de gráficos para CSV
-   Relatórios detalhados

### 📤 Exportação de Dados

-   **TXT**: Formato texto simples
-   **CSV**: Compatível com Excel
-   **JSON**: Estrutura completa com metadados
-   Backup automático no localStorage

### 📥 Importação de Dados

-   Suporte a arquivos JSON e CSV
-   Validação de estrutura de dados
-   Preview antes da importação
-   Sistema de login para segurança

### 🔐 Sistema de Autenticação

-   Login para funcionalidades restritas
-   Múltiplos usuários suportados
-   Sessão persistente
-   Logout seguro

### 💬 Sistema de Feedback

-   Formulário completo de feedback
-   Categorização por tipo e prioridade
-   Envio automático por email (Formspree)
-   Backup local de feedbacks

### 🍪 Conformidade LGPD

-   Banner de consentimento de cookies
-   Política de privacidade detalhada
-   Armazenamento local transparente
-   Controle total do usuário sobre dados

## 🛠️ Tecnologias Utilizadas

### Frontend

-   **HTML5**: Estrutura semântica
-   **CSS3**: Estilos modernos e responsivos
-   **JavaScript (ES6+)**: Funcionalidades dinâmicas
-   **Chart.js**: Gráficos interativos
-   **Formspree**: Sistema de email

### Armazenamento

-   **localStorage**: Dados locais persistentes
-   **Cookies**: Preferências de sessão
-   **IndexedDB**: Backup de dados (opcional)

### Design

-   **Gradientes CSS**: Interface moderna
-   **Animações**: Transições suaves
-   **Responsivo**: Mobile-first design
-   **Acessibilidade**: Navegação por teclado

## 📁 Estrutura do Projeto

```
diarioAPN/
├── index.html              # Página principal de registro
├── visualizar.html         # Página de visualização e gestão
├── importar.html           # Página de importação (com login)
├── style.css              # Estilos CSS completos
├── script.js              # JavaScript principal
├── logo.png               # Logo do sistema
├── README.md              # Documentação
└── LICENSE                # Licença do projeto
```

## 🚀 Como Usar

### 1. Instalação

```bash
# Clone o repositório
git clone https://github.com/kiminfodeveloper/diarioAPN.git

# Navegue para o diretório
cd diarioAPN

# Abra o arquivo principal
# No Windows: clique duplo em index.html
# No Linux/Mac: open index.html
```

### 2. Primeiro Acesso

1. **Aceite os cookies** no banner de consentimento
2. **Leia a política de privacidade** se necessário
3. **Comece a usar** o sistema

### 3. Registrando Protocolos

1. Acesse a página principal (`index.html`)
2. Preencha o **Contrato/CNPJ** da empresa
3. Confirme o **PID** (Protocolo de Identificação)
4. Complete todos os campos obrigatórios
5. Clique em **"Salvar Registro"**

### 4. Visualizando Dados

1. Acesse **"Visualizar Registros"**
2. Veja estatísticas e gráficos
3. Edite ou exclua registros conforme necessário
4. Exporte dados nos formatos desejados

### 5. Importando Dados

1. Acesse **"Importar Registros"**
2. Faça login com suas credenciais
3. Selecione arquivo JSON ou CSV
4. Confirme a importação

## 🔧 Configuração

### Sistema de Email (Feedback)

Para configurar o sistema de feedback, você tem duas opções:

#### Opção 1: EmailJS (Recomendado)

1. Crie uma conta no [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de email (Gmail, Outlook, etc.)
3. Crie um template de email com as variáveis:
    - `{{user_name}}` - Nome do usuário
    - `{{user_email}}` - Email do usuário
    - `{{feedback_type}}` - Tipo de feedback
    - `{{feedback_title}}` - Título do feedback
    - `{{feedback_priority}}` - Prioridade
    - `{{feedback_description}}` - Descrição detalhada
    - `{{feedback_timestamp}}` - Data/hora
    - `{{user_agent}}` - Navegador
    - `{{feedback_url}}` - Página de origem
4. Copie os IDs necessários:
    - **Service ID**: `service_gzeyzlb`
    - **Template ID**: `template_u2wgjxl`
    - **User ID**: `iIrbsM4l7b0J9D0Wh`
5. Os IDs já estão configurados no arquivo `visualizar.html`

#### Opção 2: Cliente de Email Padrão

Se preferir não usar EmailJS, o sistema automaticamente abrirá o cliente de email padrão:

1. Edite o arquivo `visualizar.html`
2. Substitua o email em `abrirEmailCliente()`:

```javascript
const emailTo = "seu-email@exemplo.com"; // ⚠️ Substitua pelo seu email
```

**Nota**: Se o EmailJS não estiver configurado, o sistema automaticamente usará o cliente de email padrão.

### Sistema de Login

Para adicionar novos usuários, edite em `importar.html`:

```javascript
const VALID_CREDENTIALS = {
    admin: "admin123",
    user: "user123",
    kim: "kim123",
    // Adicione novos usuários aqui
};
```

## 📊 Estrutura de Dados

### Registro de Protocolo

```json
{
    "numero": 1,
    "contrato": "12345678901234",
    "interlocutor": "João Silva",
    "protocolo": "PROT-2024-001",
    "motivo": "Solicitação de suporte técnico",
    "dataLigacao": "2024-01-15",
    "resolucao": "Resolvido",
    "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Feedback

```json
{
    "type": "bug",
    "name": "Usuário",
    "email": "usuario@exemplo.com",
    "title": "Problema no sistema",
    "description": "Descrição detalhada",
    "priority": "high",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "url": "https://exemplo.com"
}
```

## 🔒 Segurança e Privacidade

### Armazenamento Local

-   ✅ Todos os dados ficam no dispositivo
-   ✅ Sem transmissão para servidores externos
-   ✅ Controle total do usuário
-   ✅ Conformidade com LGPD

### Comunicação Online

-   📧 Apenas sistema de feedback
-   🔐 Dados mínimos necessários
-   🛡️ Criptografia em trânsito
-   📋 Consentimento explícito

### Responsabilidades

-   **Usuário**: Backup e segurança do dispositivo
-   **Sistema**: Funcionalidade e interface
-   **Desenvolvedor**: Manutenção e suporte

## 📱 Compatibilidade

### Navegadores Suportados

-   ✅ Chrome 80+
-   ✅ Firefox 75+
-   ✅ Safari 13+
-   ✅ Edge 80+
-   ✅ Opera 67+

### Dispositivos

-   ✅ Desktop (Windows, Mac, Linux)
-   ✅ Tablet (iOS, Android)
-   ✅ Mobile (iOS, Android)

## 🐛 Solução de Problemas

### Problema: Dados não salvam

**Solução**: Verifique se o localStorage está habilitado no navegador

### Problema: Feedback não envia

**Solução**: Configure corretamente o Formspree ou use backup local

### Problema: Login não funciona

**Solução**: Verifique as credenciais em `importar.html`

### Problema: Gráfico não aparece

**Solução**: Verifique se há registros salvos e conexão com Chart.js

## 📞 Suporte

### Contato Direto

-   **Telefone**: +55 11 99123-1629
-   **Email**: Via sistema de feedback
-   **GitHub**: [Issues](https://github.com/kiminfodeveloper/diarioAPN/issues)

### Sistema de Feedback

1. Acesse a página de visualização
2. Clique em **"💬 Feedback"**
3. Preencha o formulário
4. Envie sua solicitação

## 🔄 Changelog

### v2.0.0 (2024-01-15)

-   ✨ Sistema de feedback completo
-   🔐 Sistema de login para importação
-   🍪 Cookie consent e LGPD
-   📊 Gráficos interativos
-   📤 Exportação múltipla (TXT, CSV, JSON)
-   📥 Importação de dados
-   🔄 CRUD completo
-   📱 Design responsivo

### v1.0.0 (2024-01-01)

-   📝 Sistema básico de registro
-   💾 Armazenamento local
-   📋 Formulário de protocolos
-   🔍 Visualização de dados

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvimento

### Desenvolvedor

**KIM Info TEC**

-   GitHub: [@kiminfodeveloper](https://github.com/kiminfodeveloper)
-   Projeto: [diarioAPN](https://github.com/kiminfodeveloper/diarioAPN)

### Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 🙏 Agradecimentos

-   **Chart.js** - Gráficos interativos
-   **Formspree** - Sistema de email
-   **Comunidade** - Feedback e sugestões
-   **Usuários** - Testes e validação

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

**📧 Para dúvidas ou suporte: +55 11 99123-1629**
