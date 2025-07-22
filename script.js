// Variáveis globais
let registros = [];
let contadorRegistros = 1;
let statusChart = null;

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
