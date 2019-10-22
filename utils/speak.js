const speak = (text) => {
    const voice = speechSynthesis.getVoices().find(item => {
        return item.name === 'Kyoko';
    });
    let ssu = new SpeechSynthesisUtterance();
    ssu.text = text;
    ssu.voice = voice;
    speechSynthesis.speak(ssu);
};

export default speak;