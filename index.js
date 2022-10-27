const TelegramApi = require('node-telegram-bot-api');
const token = '5672396708:AAFZNrvhnvj1Q3cZSlDPPUTKCZh_aNwGbC8';
const bot = new TelegramApi(token, { polling: true });
const chats = {};
const { gameOptions, againOptions } = require('./options.js')


const startGame = async (chatId) => {
    await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/b/BigFloppaMemeStickers/BigFloppaMemeStickers_012.webp');
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифруот 0 до 9, а ты должен ее отгадать');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    console.log(randomNumber);
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие' },
        { command: '/info', description: 'Информация о вас' },
        { command: '/game', description: 'Игра "Угадай число"' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/b/BigFloppaMemeStickers/BigFloppaMemeStickers_002.webp')
            return bot.sendMessage(chatId, 'Вас приветствует Botik-kotik');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю');
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}! Держи пельмень поэтому поводу!`);
            return bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/b/BigFloppaMemeStickers/BigFloppaMemeStickers_018.webp', againOptions);

        } else {
            return bot.sendMessage(chatId, `Печально, Ты не угадал.Бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}
start();
