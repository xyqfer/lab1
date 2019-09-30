const parseFurigana = (data) => {
    const wordList = [];
    let htmlContent = '';
    data.forEach(({ text, furigana }) => {
        if (furigana !== '' && text !== furigana && !text.includes('|')) {
            wordList.push({
                text,
                furigana,
            });
        }

        let html = '';
        if (text.includes('|')) {
            html = text.replace(/\|/g, '<br>');
        } else {
            html = `<ruby>${text}<rt>${furigana}</rt></ruby>`;
        }

        htmlContent += html;
    });

    return {
        wordList,
        htmlContent,
    };
};

export default parseFurigana;