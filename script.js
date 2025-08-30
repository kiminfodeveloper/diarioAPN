// Variáveis globais
let registros = [];
let contadorRegistros = 1;

// Controle de bloqueio do formulário
let bloqueado = true;

// ===== SISTEMA DE COOKIE CONSENT =====
// Verificar se o usuário já aceitou os cookies
function checkCookieConsent() {
    const consent = localStorage.getItem("cookieConsent");
    const cookieBanner = document.getElementById("cookieBanner");

    if (!consent) {
        // Mostrar banner de cookies
        cookieBanner.style.display = "block";
    } else {
        // Esconder banner se já foi aceito
        cookieBanner.style.display = "none";
    }
}

// Aceitar cookies
function acceptCookies() {
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());

    // Esconder banner com animação
    const banner = document.getElementById("cookieBanner");
    banner.classList.add("hidden");

    setTimeout(() => {
        banner.style.display = "none";
        banner.classList.remove("hidden");
    }, 500);
}

// Mostrar modal de política de privacidade
function showPrivacyModal() {
    document.getElementById("privacyModal").style.display = "flex";
}

// Fechar modal de política de privacidade
function closePrivacyModal() {
    document.getElementById("privacyModal").style.display = "none";
}

// Inicializar sistema de cookies
document.addEventListener("DOMContentLoaded", function () {
    checkCookieConsent();

    // Event listeners para cookies
    document
        .getElementById("acceptCookies")
        .addEventListener("click", acceptCookies);
    document
        .getElementById("learnMore")
        .addEventListener("click", showPrivacyModal);
    document
        .getElementById("closePrivacyModal")
        .addEventListener("click", closePrivacyModal);

    // Fechar modal ao clicar fora
    document
        .getElementById("privacyModal")
        .addEventListener("click", function (e) {
            if (e.target === this) {
                closePrivacyModal();
            }
        });
});

// Ao carregar a página, exibir modal de contrato/CNPJ
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("modalContrato").style.display = "flex";
    document
        .getElementById("registroForm")
        .querySelectorAll("input, textarea, select, button")
        .forEach((el) => {
            if (
                el.id !== "inputContratoModal" &&
                el.id !== "btnConfirmContrato"
            )
                el.disabled = true;
        });
});

// Modal Contrato/CNPJ
const modalContrato = document.getElementById("modalContrato");
const inputContratoModal = document.getElementById("inputContratoModal");
const btnConfirmContrato = document.getElementById("btnConfirmContrato");

btnConfirmContrato.addEventListener("click", function () {
    const valor = inputContratoModal.value.trim();
    if (!valor) {
        inputContratoModal.focus();
        inputContratoModal.style.borderColor = "#f56565";
        return;
    }
    inputContratoModal.style.borderColor = "#e2e8f0";
    modalContrato.style.display = "none";
    // Abrir modal PID
    document.getElementById("modalPID").style.display = "flex";
});

inputContratoModal.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btnConfirmContrato.click();
});

// Modal PID
const modalPID = document.getElementById("modalPID");
const btnPIDSim = document.getElementById("btnPIDSim");
const btnPIDNao = document.getElementById("btnPIDNao");

btnPIDSim.addEventListener("click", function () {
    // Preencher campo contrato e liberar formulário
    const valor = inputContratoModal.value.trim();
    document.getElementById("contrato").value = valor;
    document.getElementById("contrato").readOnly = true;
    document
        .getElementById("registroForm")
        .querySelectorAll("input, textarea, select, button")
        .forEach((el) => {
            el.disabled = false;
        });
    bloqueado = false;
    modalPID.style.display = "none";
    // Limpar input do modal para o próximo ciclo
    inputContratoModal.value = "";
});

btnPIDNao.addEventListener("click", function () {
    alert("Por favor, confirme o PID antes de prosseguir.");
    modalPID.style.display = "none";
    modalContrato.style.display = "flex";
    inputContratoModal.focus();
});

// Bloquear envio do formulário se bloqueado
const registroForm = document.getElementById("registroForm");
registroForm.addEventListener("submit", function (e) {
    if (bloqueado) {
        e.preventDefault();
        return;
    }
});

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
    carregarRegistros();
    exibirRegistros();

    // Definir data atual por padrão
    document.getElementById("dataLigacao").valueAsDate = new Date();
});

// Event listeners
document
    .getElementById("registroForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        salvarRegistro();
    });

document.getElementById("exportBtn").addEventListener("click", exportarParaTXT);

const btnVisualizar = document.getElementById("btnVisualizar");
if (btnVisualizar) {
    btnVisualizar.addEventListener("click", function () {
        window.location.href = "visualizar.html";
    });
}

// Função para limpar registros do localStorage e atualizar a interface
function limparRegistros() {
    if (
        confirm(
            "Tem certeza que deseja limpar todos os registros? Esta ação não pode ser desfeita."
        )
    ) {
        localStorage.removeItem("registrosAPN");
        registros = [];
        contadorRegistros = 1;
        exibirRegistros();
        mostrarMensagemLimpeza();
    }
}

function mostrarMensagemLimpeza() {
    const mensagem = document.createElement("div");
    mensagem.className = "success-message";
    mensagem.style.background = "#fed7d7";
    mensagem.style.color = "#742a2a";
    mensagem.style.borderLeft = "4px solid #f56565";
    mensagem.textContent = "Todos os registros foram removidos!";

    const recordsSection = document.querySelector(".records-section");
    recordsSection.insertBefore(mensagem, recordsSection.firstChild);

    setTimeout(() => {
        mensagem.remove();
    }, 3000);
}

// Função para carregar registros do localStorage
function carregarRegistros() {
    const saved = JSON.parse(localStorage.getItem("registrosAPN") || "[]");
    registros = saved;
    if (registros.length > 0) {
        contadorRegistros = Math.max(...registros.map((r) => r.numero)) + 1;
    }
}

// Função para salvar registro
function salvarRegistro() {
    if (bloqueado) return;
    const form = document.getElementById("registroForm");
    const formData = new FormData(form);

    const novoRegistro = {
        numero: contadorRegistros++,
        contrato: formData.get("contrato"),
        interlocutor: formData.get("interlocutor"),
        protocolo: formData.get("protocolo"),
        motivo: formData.get("motivo"),
        dataLigacao: formData.get("dataLigacao"),
        resolucao: formData.get("resolucao"),
        timestamp: new Date().toISOString(),
    };

    registros.push(novoRegistro);

    // Salvar no localStorage
    localStorage.setItem("registrosAPN", JSON.stringify(registros));

    // Limpar formulário
    form.reset();
    document.getElementById("dataLigacao").valueAsDate = new Date();

    // Exibir mensagem de sucesso
    mostrarMensagemSucesso();

    // Atualizar lista
    exibirRegistros();

    // Bloquear novamente e pedir novo Contrato/CNPJ e PID
    bloqueado = true;
    document.getElementById("contrato").readOnly = false;
    document.getElementById("contrato").value = "";
    document
        .getElementById("registroForm")
        .querySelectorAll("input, textarea, select, button")
        .forEach((el) => {
            if (
                el.id !== "inputContratoModal" &&
                el.id !== "btnConfirmContrato"
            )
                el.disabled = true;
        });
    modalContrato.style.display = "flex";
    inputContratoModal.focus();
}

// Função para exibir registros
function exibirRegistros() {
    const container = document.getElementById("recordsList");

    if (registros.length === 0) {
        container.innerHTML =
            '<div class="no-records">Nenhum registro encontrado</div>';
        return;
    }

    container.innerHTML = registros
        .map(
            (registro) => `
        <div class="record-item">
            <div class="record-header">
                <div class="record-number">Registro Nº${registro.numero}</div>
                <div class="resolution-badge resolution-${registro.resolucao
                    .toLowerCase()
                    .replace("ã", "a")}">
                    ${registro.resolucao}
                </div>
            </div>
            <div class="record-details">
                <div class="detail-item">
                    <div class="detail-label">Empresa/CNPJ</div>
                    <div class="detail-value">${registro.contrato}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Interlocutor</div>
                    <div class="detail-value">${registro.interlocutor}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Protocolo</div>
                    <div class="detail-value">${registro.protocolo}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Data da Ligação</div>
                    <div class="detail-value">${formatarData(
                        registro.dataLigacao
                    )}</div>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-label">Motivo</div>
                    <div class="detail-value">${registro.motivo}</div>
                </div>
            </div>
        </div>
    `
        )
        .join("");
}

// Função para mostrar mensagem de sucesso
function mostrarMensagemSucesso() {
    const mensagem = document.createElement("div");
    mensagem.className = "success-message";
    mensagem.textContent = "Registro salvo com sucesso!";

    const formSection = document.querySelector(".form-section");
    formSection.insertBefore(mensagem, formSection.firstChild);

    setTimeout(() => {
        mensagem.remove();
    }, 3000);
}

// Função para formatar data
function formatarData(dataISO) {
    const data = new Date(dataISO + "T00:00:00");
    return data.toLocaleDateString("pt-BR");
}

// Função para exportar para TXT
function exportarParaTXT() {
    if (registros.length === 0) {
        alert("Não há registros para exportar!");
        return;
    }

    let conteudo = "DIÁRIO DE REGISTRO APN\n";
    conteudo += "========================\n\n";

    registros.forEach((registro) => {
        conteudo += `Registro Nº${registro.numero}\n`;
        conteudo += `Empresa/CNPJ: ${registro.contrato}\n`;
        conteudo += `Interlocutor: ${registro.interlocutor}\n`;
        conteudo += `Protocolo: ${registro.protocolo}\n`;
        conteudo += `Motivo: ${registro.motivo}\n`;
        conteudo += `Data: ${formatarData(registro.dataLigacao)}\n`;
        conteudo += `Resolução: ${registro.resolucao}\n\n`;
        conteudo += "---\n\n";
    });

    // Criar e baixar arquivo
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `registros_apn_${
        new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
