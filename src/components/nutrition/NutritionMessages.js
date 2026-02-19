export const nutritionMessages = [
    "Evite refrigerante hoje.",
    "Beba mais água.",
    "Não exagere no hambúrguer.",
    "Prefira comida natural.",
    "Você está cuidando do seu futuro.",
    "Disciplina hoje, resultado amanhã.",
    "Descasque mais, desembale menos.",
    "Seu corpo é seu templo.",
    "Açúcar vicia. Quebre o ciclo.",
    "Coma devagar e saboreie.",
    "Legumes e verduras são vida!",
    "Você é o que você come."
];

export const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * nutritionMessages.length);
    return nutritionMessages[randomIndex];
};
