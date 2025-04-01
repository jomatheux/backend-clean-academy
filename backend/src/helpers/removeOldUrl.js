import fs from 'fs';

// Função para remover a url antiga de um entidade
const removeOldImage = (entity) => {
    if (!entity.url) {
        console.log("Nenhuma url antiga para deletar.");
        return;
    }

    fs.unlink(`src/public/${entity.url}`, (err) => {
        if (err) {
            console.error(`Erro ao deletar a url: ${err.message}`);
        } else {
            console.log(`Url antiga deletada com sucesso: ${entity.url}`);
        }
    });
}

export default removeOldImage;