import { Request, Response } from 'express';
import mercadopago from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../global/enviorenment";


export const createOrder = async (req: Request, res: Response) => {



    mercadopago.configure({
        access_token: "TEST-4655127474104645-110520-0cbd49c77cb403003bce27a712a781a1-1537929468",
      });
    
      const { motivo, precio } = req.body;

        const result = await mercadopago.preferences.create({
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
    };
//ESTA FUNCION ESCUCHA EVENTOS QUE LLEGAN DESDE MERCADO PAGO
export const receiveWebhook = async (req: Request, res: Response) => {
  console.log('AQUI ESTA EL req.query',req.query);
  const paymentType = req.query.type;
  console.log('AQUI ESTA EL paymentType',paymentType)
  const paymentIdStr = req.query["data.id"];
  console.log('AQUI ESTA EL paymentIdStr',paymentIdStr)

  try {
      if (paymentType === "payment" && typeof paymentIdStr === 'string') {
          const paymentIdNum = parseInt(paymentIdStr, 10); // Crea una nueva variable para el valor numérico
          if (!isNaN(paymentIdNum)) { // Verificar que es un número válido
              const data = await mercadopago.payment.findById(paymentIdNum);
              console.log('AQUI ESTA LA DATA',data);
              // Guardar en base de datos
              // ...
          } else {
              // Manejar el caso donde paymentId no es un número válido
          }
      } else {
          // Manejar otros casos, como cuando paymentType no es 'payment'
      }
      res.sendStatus(200);
  } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
  }
};

    
 
    
    /*

    export const receiveWebhook = async (req: Request, res: Response) => {
        console.log(req.query);

        res.send("webhook");

    };


    */