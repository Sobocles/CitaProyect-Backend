import {Router} from 'express'
import { createOrder, receiveWebhook } from '../controllers/mercadoPago';
import { getAllFacturas, obtenerFacturaPorId, eliminarFactura } from '../controllers/facturas';
import ValidarJwt from '../middlewares/validar-jwt';



const router = Router()

router.post('/create-order', ValidarJwt.instance.validarJwt
,createOrder )

router.get('/success',(req, res) => res.send('success'))

router.get('/factura', 
getAllFacturas

 );

 router.delete('/factura/:id', ValidarJwt.instance.validarJwt,
 eliminarFactura);

 router.get('/factura/:id', ValidarJwt.instance.validarJwt,
 obtenerFacturaPorId

 );




router.get('/failure',(req, res) => res.send('failure'))

router.get('/pending',(req, res) => res.send('pending'))

router.post('/webhook', receiveWebhook )

export default router;