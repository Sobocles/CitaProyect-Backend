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
const factura_1 = __importDefault(require("../models/factura"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const medico_1 = __importDefault(require("../models/medico"));
const usuario_1 = __importDefault(require("../models/usuario"));
const emails_1 = __importDefault(require("../helpers/emails"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    mercadopago_1.default.configure({
        access_token: "TEST-4655127474104645-110520-0cbd49c77cb403003bce27a712a781a1-1537929468",
    });
    /*  const { motivo, precio, idCita } = req.body; */
    const motivo = req.body.motivo; // o cualquier otro tipo que se espera aquí
    const precio = req.body.precio;
    const idCita = req.body.idCita;
    const preference = {
        items: [
            {
                title: motivo,
                unit_price: precio,
                currency_id: "CLP",
                quantity: 1,
            }
        ],
        //success: "http://localhost:8000/api/mercadoPago/success",
        external_reference: `${idCita}`,
        back_urls: {
            success: `http://localhost:4200/payment-success?idCita=${idCita}`,
            failure: "http://localhost:4200/payment-failure",
            pending: "http://localhost:8000/api/mercadoPago/pending"
        },
        notification_url: "https://3dc2-2800-150-14e-fe7-b93e-d68-3c4f-580f.ngrok.io/api/mercadoPago/webhook"
    };
    try {
        const result = yield mercadopago_1.default.preferences.create(preference);
        console.log(result);
        res.send(result.response);
    }
    catch (error) {
        const e = error;
        res.status(500).send(e.message);
    }
});
exports.createOrder = createOrder;
//ESTA FUNCION ESCUCHA EVENTOS QUE LLEGAN DESDE MERCADO PAGO
const receiveWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIdStr = req.query["data.id"];
        const paymentType = req.query.type;
        if (paymentType === "payment" && paymentIdStr) {
            const paymentIdNum = parseInt(paymentIdStr, 10);
            if (!isNaN(paymentIdNum)) {
                const paymentData = yield mercadopago_1.default.payment.findById(paymentIdNum);
                console.log('Payment Data:', paymentData);
                // Aquí se asume que la respuesta de MercadoPago viene en el formato esperado
                if (paymentData.status === 200 && paymentData.response) {
                    const { response } = paymentData;
                    // Crear el objeto factura con los datos relevantes
                    const facturaData = {
                        id_cita: parseInt(response.external_reference, 10),
                        payment_method_id: response.payment_method_id,
                        transaction_amount: response.transaction_amount,
                        payment_status: response.status,
                        status_detail: response.status_detail,
                        monto_pagado: response.transaction_amount,
                        estado_pago: response.status === 'approved' ? 'completado' : 'pendiente',
                    };
                    console.log('AQUI ESTA LA FACTURA', facturaData);
                    // Guardar en la base de datos
                    const nuevaFactura = yield factura_1.default.create(facturaData);
                    console.log('Nueva factura creada:', nuevaFactura);
                    if (response.status === 'approved') {
                        yield cita_medica_1.default.update({ estado: 'pagado' }, { where: { idCita: facturaData.id_cita } });
                    }
                    const cita = yield cita_medica_1.default.findOne({
                        where: { idCita: facturaData.id_cita },
                        include: [{
                                model: medico_1.default,
                                as: 'medico', // Asegúrate de que tienes configurada la relación en Sequelize con este alias
                            }, {
                                model: usuario_1.default,
                                as: 'paciente', // Asegúrate de que tienes configurada la relación en Sequelize con este alias
                            }]
                    });
                    console.log('AQUI ESTA LA CITA', cita);
                    if (cita && cita.medico && cita.paciente) {
                        // Preparar los detalles para el correo electrónico
                        const detallesCita = {
                            fecha: cita.fecha,
                            hora_inicio: cita.hora_inicio,
                            medicoNombre: `${cita.medico.nombre} ${cita.medico.apellidos}`,
                            especialidad: cita.medico.especialidad_medica,
                            pacienteNombre: `${cita.paciente.nombre} ${cita.paciente.apellidos}`,
                            emailPaciente: cita.paciente.email, // Asegúrate de que el modelo Usuario tiene un campo de email
                            // ... cualquier otro detalle necesario ...
                        };
                        console.log('AQUI ESTA EL DETALLE DE LA CITA', detallesCita);
                        // Envía el correo electrónico de confirmación
                        try {
                            yield emails_1.default.instance.enviarConfirmacionCita(detallesCita);
                            console.log('Correo de confirmación enviado al paciente:', detallesCita.emailPaciente);
                        }
                        catch (error) {
                            console.error('Error al enviar correo de confirmación:', error);
                        }
                    }
                    res.sendStatus(200);
                }
                else {
                    // Manejar situaciones donde la respuesta no es exitosa
                    console.error('Payment not found or error with payment data');
                    res.sendStatus(404);
                }
            }
            else {
                // Manejar el caso donde paymentId no es un número válido
                console.error('Invalid payment ID');
                res.sendStatus(400);
            }
        }
        else {
            // Manejar otros casos, como cuando paymentType no es 'payment'
            console.error('Not a payment type or missing payment ID');
            res.sendStatus(400);
        }
    }
    catch (error) {
        console.error('Error in receiveWebhook:', error);
        res.status(500).json({ error: error.message });
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