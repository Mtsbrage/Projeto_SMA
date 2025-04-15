document.addEventListener("DOMContentLoaded", () => {
    const verifyButton = document.getElementById("verifyButton");
    const statusElement = document.getElementById("status");

    // Verifica se o SDK foi carregado corretamente
    if (typeof this['@combateafraude/identity-sdk'] === "undefined") {
        console.error("SDK não carregado! Verifique a URL do CDN.");
        statusElement.textContent = "Erro: SDK não carregado!";
        return;
    }

    // Token de identidade e opções de configuração
    const identityToken = 'xxxxxxxxx'; // Coloque o token de identidade aqui
    const identityOptions = {
        mobileToken: 'xxxxxxxxx', // Opcional, se estiver utilizando autenticação facial em dispositivos móveis
        throwOnRecall: true,
        theme: {
            closeButton: '#000037',
            pendingIconSvg: './example.svg',
        },
        smsLabel: {
            enable: true,
            link: "https://www.google.com/",
            text: "It's just a test SMS",
        },
        language: "pt-BR",
        pendingPageSettings: {
            titleText: "Não foi possível realizar a autenticação",
            descriptionText: "Para sua segurança, entre em contato com o suporte para prosseguir",
            buttonContentText: "Finalizar"
        },
        faceLivenessSettings: {
            startButton: {
                label: 'Tirar foto',
                color: "white",
                backgroundColor: "#000037",
                border: '1px solid #000037'
            },
            permissionButton: {
                label: 'Habilitar câmera',
                color: "white",
                backgroundColor: "#000037",
                border: '1px solid #000037'
            }
        },
        enableTimer: true,
    };

    // Inicializa o SDK
    const identity = new this['@combateafraude/identity-sdk'].Sdk(identityToken, identityOptions);

    // Definindo um policyId fixo
    const policyId = "xxxxxxx"; // Defina seu policyId fixo aqui

    // Função para verificar o usuário
    const verifyUser = async () => {
        const cpf = prompt("Digite o CPF do usuário:");

        if (!cpf) {
            statusElement.textContent = "CPF não informado.";
            return;
        }

        // Chama o SDK com o CPF e o policyId fixo
        try {
            const sdkResponse = await identity.verifyPolicy(cpf, policyId);

            if (identity.isSdkError(sdkResponse)) {
                console.error("Erro ao executar o SDK:", sdkResponse);
                statusElement.textContent = "Erro ao executar o SDK!";
            } else {
                const { isAuthorized, attestation, attemptId } = sdkResponse;

                if (isAuthorized) {
                    statusElement.textContent = "Usuário autorizado com sucesso!";
                    console.log("Attestation:", attestation);
                } else {
                    statusElement.textContent = "Usuário não autorizado.";
                }
            }
        } catch (error) {
            console.error("Erro ao verificar usuário:", error);
            statusElement.textContent = "Erro inesperado durante a verificação!";
        }
    };

    // Adiciona o evento de clique ao botão
    verifyButton.addEventListener("click", verifyUser);
});
