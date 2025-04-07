import fs from "fs";
// Função para remover a imagem antiga de um entidade

const removeOldImage = (entity) => {
    if (!entity.image) {
        console.log("Nenhuma imagem antiga para deletar.");
        return;
    }

    fs.unlink(`src/public/${entity.image}`, (err) => {
        if (err) {
            console.error(`Erro ao deletar a imagem: ${err.message}`);
        } else {
            console.log(`Imagem antiga deletada com sucesso, nova imagem: ${entity.image}`);
        }
    });
};

export default removeOldImage;