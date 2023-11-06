"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveWebhook = exports.createOrder = void 0;
const mercadopago_1 = __importDefault(require("mercadopago"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    mercadopago_1.default.configure({
        access_token: "TEST-4655127474104645-110520-0cbd49c77cb403003bce27a712a781a1-1537929468",
    });
    const { motivo, precio } = req.body;
    const result = yield mercadopago_1.default.preferences.create({
        items: [
            {
                title: motivo,
                unit_price: precio,
                currency_id: "CLP",
                quantity: 1,
            },
        ],
        back_urls: {
            success: "http://localhost:8000/api/mercadoPago/success",
            failure: "http://localhost:8000/api/mercadoPago/failure",
            pending: "http://localhost:8000/api/mercadoPago/pending",
        },
        notification_url: "https://025d-2800-150-14e-fe7-38c4-a84e-9c4b-a245.ngrok.io/api/mercadoPago/webhook",
    });
    console.log(result);
    // res.json({ message: "Payment creted" });
    res.send(result.body);
});
exports.createOrder = createOrder;
//ESTA FUNCION ESCUCHA EVENTOS QUE LLEGAN DESDE MERCADO PAGO
const receiveWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('AQUI ESTA EL req.query', req.query);
    const paymentType = req.query.type;
    console.log('AQUI ESTA EL paymentType', paymentType);
    const paymentIdStr = req.query["data.id"];
    console.log('AQUI ESTA EL paymentIdStr', paymentIdStr);
    try {
        if (paymentType === "payment" && typeof paymentIdStr === 'string') {
            const paymentIdNum = parseInt(paymentIdStr, 10); // Crea una nueva variable para el valor numérico
            if (!isNaN(paymentIdNum)) { // Verificar que es un número válido
                const data = yield mercadopago_1.default.payment.findById(paymentIdNum);
                console.log('AQUI ESTA LA DATA', data);
                // Guardar en base de datos
                // ...
            }
            else {
                // Manejar el caso donde paymentId no es un número válido
            }
        }
        else {
            // Manejar otros casos, como cuando paymentType no es 'payment'
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});
exports.receiveWebhook = receiveWebhook;
/*

export const receiveWebhook = async (req: Request, res: Response) => {
    console.log(req.query);

    res.send("webhook");

};


*/ 
//# sourceMappingURL=mercadoPago.js.map