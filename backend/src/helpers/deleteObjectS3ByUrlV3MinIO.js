import * as Minio from 'minio';

// Configurar o Minio Client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT_URL || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true' || false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// Função para remover um objeto do Minio dada a URL
const deleteObjectMinioByUrl = async (url) => {
  if (!url) {
    console.log("Nenhuma URL do Minio fornecida para deletar.");
    return;
  }

  try {
    const urlParts = new URL(url);
    const pathname = urlParts.pathname.startsWith('/') ? urlParts.pathname.substring(1) : urlParts.pathname;
    const bucket = pathname.split('/')[0];
    const key = pathname.substring(pathname.indexOf('/') + 1);

    if (!bucket || !key) {
      console.error(`URL do Minio inválida: ${url}`);
      return;
    }

    await minioClient.removeObject(bucket, key);
    console.log(`Objeto do Minio deletado com sucesso: ${url}`);
    return;
  } catch (error) {
    console.error(`Erro ao deletar o objeto do Minio: ${error.message}`);
    throw error;
  }
};

export default deleteObjectMinioByUrl;