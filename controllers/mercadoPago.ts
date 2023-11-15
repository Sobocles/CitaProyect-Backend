import { Request, Response } from 'express';
import mercadopago from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../global/enviorenment";
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import Factura from '../models/factura'; 
import CitaMedica from '../models/cita_medica';
import Medico from '../models/medico';
import Usuario from '../models/usuario';
import Email from '../helpers/emails';

export const createOrder = async (req: Request, res: Response) => {
    mercadopago.configure({
        access_token: "TEST-4655127474104645-110520-0cbd49c77cb403003bce27a712a781a1-1537929468",
      });
    
    /*  const { motivo, precio, idCita } = req.body; */

    const motivo: string = req.body.motivo; // o cualquier otro tipo que se espera aquí
    const precio: number = req.body.precio;
    const idCita: number = req.body.idCita;
      

    const preference: CreatePreferencePayload = {
      items: [
        {
          title: motivo,
          unit_price: precio,
          currency_id: "CLP", // Aquí asegúrate que el valor es uno de los valores permitidos por MercadoPago
          quantity: 1,
        }
      ],
    
      //success: "http://localhost:8000/api/mercadoPago/success",
      external_reference: `${idCita}`, // Asegúrate de que citaId es un string
      back_urls: {
        success: `http://localhost:4200/payment-success?idCita=${idCita}`,
        failure: "http://localhost:4200/payment-failure",
        pending: "http://localhost:8000/api/mercadoPago/pending"
      },
      notification_url: "https://702b-2800-150-14e-fe7-94e6-e2dd-926e-ad09.ngrok.io/api/mercadoPago/webhook"
    };
    
    try {
      const result = await mercadopago.preferences.create(preference);
      console.log(result);
      res.send(result.response);
    } catch (error) {
      const e = error as { message: string };
      res.status(500).send(e.message);
    }
};
//ESTA FUNCION ESCUCHA EVENTOS QUE LLEGAN DESDE MERCADO PAGO
export const receiveWebhook = async (req: Request, res: Response) => {
  try {
    const paymentIdStr: string = req.query["data.id"] as string;
    const paymentType: string = req.query.type as string;

    if (paymentType === "payment" && paymentIdStr) {
      const paymentIdNum = parseInt(paymentIdStr, 10);
      if (!isNaN(paymentIdNum)) {
        const paymentData = await mercadopago.payment.findById(paymentIdNum);
        console.log('Payment Data:', paymentData);

        // Aquí se asume que la respuesta de MercadoPago viene en el formato esperado
        if (paymentData.status === 200 && paymentData.response) {
          const { response } = paymentData;
          const fechaAprobacionPago = response.date_approved;
          // Crear el objeto factura con los datos relevantes
          const facturaData = {
            id_cita: parseInt(response.external_reference, 10),
            payment_method_id: response.payment_method_id,
            transaction_amount: response.transaction_amount,
            payment_status: response.status, // Asumiendo que 'status' es un campo válido
            status_detail: response.status_detail,
            monto_pagado: response.transaction_amount, // Asumiendo que esto es el monto pagado
            estado_pago: response.status === 'approved' ? 'completado' : 'pendiente',
            fecha_pago: new Date(fechaAprobacionPago)
          };

          console.log('AQUI ESTA LA FACTURA',facturaData);

          // Guardar en la base de datos
          const nuevaFactura = await Factura.create(facturaData);
          console.log('Nueva factura creada:', nuevaFactura);

          if (response.status === 'approved') {
            await CitaMedica.update(
              { estado: 'pagado' },
              { where: { idCita: facturaData.id_cita } }
            );
          }

          const cita = await CitaMedica.findOne({
            where: { idCita: facturaData.id_cita },
            include: [{
              model: Medico,
              as: 'medico', // Asegúrate de que tienes configurada la relación en Sequelize con este alias
            }, {
              model: Usuario,
              as: 'paciente', // Asegúrate de que tienes configurada la relación en Sequelize con este alias
            }]
          });
          console.log('AQUI ESTA LA CITA',cita);
        
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
            console.log('AQUI ESTA EL DETALLE DE LA CITA',detallesCita)
            // Envía el correo electrónico de confirmación
            try {
              await Email.instance.enviarConfirmacionCita(detallesCita);
              console.log('Correo de confirmación enviado al paciente:', detallesCita.emailPaciente);
            } catch (error) {
              console.error('Error al enviar correo de confirmación:', error);
            }
          }

          

          res.sendStatus(200);
        } else {
          // Manejar situaciones donde la respuesta no es exitosa
          console.error('Payment not found or error with payment data');
          res.sendStatus(404);
        }
      } else {
        // Manejar el caso donde paymentId no es un número válido
        console.error('Invalid payment ID');
        res.sendStatus(400);
      }
    } else {
      // Manejar otros casos, como cuando paymentType no es 'payment'
      console.error('Not a payment type or missing payment ID');
      res.sendStatus(400);
    }
  } catch (error: any) {
    console.error('Error in receiveWebhook:', error);
    res.status(500).json({ error: error.message });
  }
};

    
 
    
    /*

    export const receiveWebhook = async (req: Request, res: Response) => {
        console.log(req.query);

        res.send("webhook");

    };


    */