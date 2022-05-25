const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5345588658:AAFaEZpXSOhkbFquP-CNP2Uovlla05OFHXA";

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
	await bot.sendMessage(
		chatId,
		"Сейчас я загадаю цифру от 0 до 9,  a ты должен будешь ее отгадать"
	);
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
	bot.setMyCommands([
		{ command: "/start", description: "Запуск бота" },
		{ command: "/info", description: "Получаем  информацию о пользователе" },
		{ command: "/game", description: "Игра - угадай цифру" },
	]);

	bot.on("message", async (msg) => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === "/start") {
			await bot.sendSticker(
				chatId,
				"https://tgram.ru/wiki/stickers/img/animefanf/png/8.png"
			);
			return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`);
		}
		if (text === "/info") {
			return bot.sendMessage(
				chatId,
				`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
			);
		}
		if (text === "/game") {
			return startGame(chatId);
		}

		return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!)");
	});

	bot.on("callback_query", async (msg) => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === "/again") {
			return startGame(chatId);
		}
		if (+data === chats[chatId]) {
			return await bot.sendMessage(
				chatId,
				`Поздравляю, ты отгадал цифру ${chats[chatId]}`,
				againOptions
			);
		} else {
			return await bot.sendMessage(
				chatId,
				`К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
				againOptions
			);
		}
	});
};

start();
