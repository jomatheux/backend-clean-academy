import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configurar o S3 Client v3 (certifique-se de que suas configurações estão corretas)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Função para remover um objeto do S3 dada a URL (usando v3)
const deleteObjectS3ByUrlV3 = async (url) => {
    if (!url) {
        console.log("Nenhuma URL do S3 fornecida para deletar.");
        return;
    }

    try {
        const urlParts = new URL(url);
        const pathname = urlParts.pathname.startsWith('/') ? urlParts.pathname.substring(1) : urlParts.pathname;
        const bucket = pathname.split('/')[0];
        const key = pathname.substring(pathname.indexOf('/') + 1);

        if (!bucket || !key) {
            console.error(`URL do S3 inválida: ${url}`);
            return;
        }

        const deleteParams = {
            Bucket: bucket,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        const response = await s3Client.send(command);
        console.log(`Objeto do S3 deletado com sucesso: ${url}`);
        console.log("Resposta do S3:", response);
        return response; // Pode ser útil retornar a resposta
    } catch (error) {
        console.error(`Erro ao deletar o objeto do S3: ${error.message}`);
        throw error; // Rejeitar a promise para tratamento no chamador
    }
};

export default deleteObjectS3ByUrlV3;