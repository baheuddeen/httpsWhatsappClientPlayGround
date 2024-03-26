import { Client, LocalAuth } from'whatsapp-web.js';
import qrcode from'qrcode-terminal';
import { getData } from './GetData';

export default class WhatsappClient {
    private client: Client;

    constructor() {
        this.client = new Client({
            puppeteer: { headless: true },
            authStrategy: new LocalAuth({
                    dataPath: './data.json',
                }
            ),
        });
    }

    listen() {
        this.client.on('ready',this.onReady.bind(this));

        this.client.on('qr', qr => {
            qrcode.generate(qr, {small: true});
        });

        this.client.on('message', message => {
            console.log('New message:', message.body);
            // when a message is received, check if it starts with 'love'
            const words = message.body.split(' ');
            if (words[0].toLocaleLowerCase() !== 'love') {
                return;
            }
            const number = message.from;
            // get the number of times the message should be sent
            const count = parseInt(words[1], 10);
            if (isNaN(count)) {
                return;
            }
            if (count > 100) {
                this.client.sendMessage(number, 'I love you too much!');
                return;
            }
            for (let i = 0; i < count; i++) {
                this.client.sendMessage(number, 'I love you!');
            }
        });
    }

    async onReady() {
        console.log('Client is ready!');
        const data = await getData();
        let counter = 0;
        const interval = setInterval(() => {
            if (counter >= data.length) {
                clearInterval(interval);
                return;
            }
            const row = data[counter];
            const number = `${
                row.number.replace(/\D/g, '')
            }@c.us`;
            this.client.sendMessage(number, `Hi ${row.firstName}!`);
            counter++;
        }
        , 1000);
    }

    initialize() {
        this.client.initialize();
    }
}
