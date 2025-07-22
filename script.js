// Variáveis globais
let registros = [];
let contadorRegistros = 1;
let statusChart = null;

// Controle de bloqueio do formulário
let bloqueado = true;

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
    criarGrafico();

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

document.getElementById("clearBtn").addEventListener("click", limparRegistros);

document
    .getElementById("exportChartBtn")
    .addEventListener("click", exportarGraficoParaCSV);

const btnVisualizar = document.getElementById("btnVisualizar");
if (btnVisualizar) {
    btnVisualizar.addEventListener("click", function () {
        window.location.href = "visualizar.html";
    });
}

function exportarGraficoParaCSV() {
    const stats = calcularEstatisticas();
    const linhas = [
        ["Status", "Quantidade"],
        ["Resolvido", stats.resolvidos],
        ["BKO", stats.bko],
        ["Supervisão", stats.supervisao],
    ];
    const csv = linhas.map((linha) => linha.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `estatisticas_grafico_apn_${
        new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        atualizarGrafico();
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

    // Atualizar gráfico
    atualizarGrafico();

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

// Função para criar gráfico
function criarGrafico() {
    const ctx = document.getElementById("statusChart").getContext("2d");

    if (registros.length === 0) {
        document.querySelector(".chart-container").innerHTML =
            '<div class="no-data-message">📊 Nenhum dado disponível para exibir gráfico</div>';
        return;
    }

    const dados = calcularEstatisticas();

    statusChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Resolvidos", "BKO", "Supervisão"],
            datasets: [
                {
                    data: [dados.resolvidos, dados.bko, dados.supervisao],
                    backgroundColor: [
                        "#48bb78", // Verde para resolvidos
                        "#f56565", // Vermelho para BKO
                        "#ed8936", // Laranja para Supervisão
                    ],
                    borderColor: ["#38a169", "#e53e3e", "#dd6b20"],
                    borderWidth: 2,
                    hoverOffset: 10,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Status dos Protocolos",
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                    color: "#4a5568",
                },
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                        },
                        color: "#4a5568",
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || "";
                            const value = context.parsed;
                            const total = context.dataset.data.reduce(
                                (a, b) => a + b,
                                0
                            );
                            const percentage = ((value / total) * 100).toFixed(
                                1
                            );
                            return `${label}: ${value} (${percentage}%)`;
                        },
                    },
                },
            },
        },
    });
}

// Função para calcular estatísticas
function calcularEstatisticas() {
    const stats = {
        resolvidos: 0,
        bko: 0,
        supervisao: 0,
    };

    registros.forEach((registro) => {
        switch (registro.resolucao) {
            case "Resolvido":
                stats.resolvidos++;
                break;
            case "BKO":
                stats.bko++;
                break;
            case "Supervisão":
                stats.supervisao++;
                break;
        }
    });

    return stats;
}

// Função para atualizar gráfico
function atualizarGrafico() {
    if (registros.length === 0) {
        if (statusChart) {
            statusChart.destroy();
            statusChart = null;
        }
        document.querySelector(".chart-container").innerHTML =
            '<div class="no-data-message">📊 Nenhum dado disponível para exibir gráfico</div>';
        return;
    }

    const dados = calcularEstatisticas();

    if (!statusChart) {
        // Se o gráfico não existe, criar
        if (document.querySelector(".no-data-message")) {
            document.querySelector(".chart-container").innerHTML =
                '<canvas id="statusChart"></canvas>';
        }
        criarGrafico();
    } else {
        // Atualizar dados existentes
        statusChart.data.datasets[0].data = [
            dados.resolvidos,
            dados.bko,
            dados.supervisao,
        ];
        statusChart.update();
    }
}
