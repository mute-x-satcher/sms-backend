const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const { sendQREmail } = require('../nodemailer/nodemail');
const QRCode = require('qrcode');

let clientInstance = null;

function getClient() {
    if (clientInstance) return clientInstance;

    const client = new Client({
        authStrategy: new LocalAuth()
    });

    let lastQrTime = 0;
    let isAuthenticated = false;

        client.on('authenticated', () => {
        console.log('✅ WhatsApp authenticated');
        isAuthenticated = true;
    });

    client.on('ready', () => {
        console.log('🤖 WhatsApp client is ready!');
        isAuthenticated = true;  // Also mark authenticated when ready
    });

    client.on('qr', async (qr) => {
        if (isAuthenticated) {
            // Already authenticated, no need to generate QR code
            return;
        }

        const now = Date.now();

        if (now - lastQrTime > 10000) {  // throttle QR generation every 10 seconds
            lastQrTime = now;

            try {
                console.log('Generating QR...');
                qrcodeTerminal.generate(qr, { small: true });

                const qrBuffer = await QRCode.toBuffer(qr);
                await sendQREmail('mutex7171@gmail.com', qrBuffer);
                console.log('📧 QR code buffer sent via email');
            } catch (error) {
                console.error('❌ Failed to generate/send QR buffer:', error);
            }
        }
    });


    client.on('disconnected', reason => {
        console.log('❌ WhatsApp client disconnected:', reason);
        isAuthenticated = false;  // Reset auth flag on disconnect
    });

    client.initialize();
    clientInstance = client;

    return clientInstance;
}

async function destroyClient() {
    if (clientInstance) {
        console.log('🛑 Destroying WhatsApp client...');
        await clientInstance.destroy();
        clientInstance = null;
        console.log('✅ WhatsApp client destroyed.');
    }
}

process.on('SIGINT', destroyClient);

module.exports = getClient;