
import { Router } from 'express';

import { getDocumentosColeccion, getTodo} from '../controllers/busquedas';
import ValidarJwt from '../middlewares/validar-jwt';


const router = Router();


router.get('/:busqueda', ValidarJwt.instance.validarJwt,

getTodo );


router.get('/coleccion/:tabla/:busqueda', ValidarJwt.instance.validarJwt,
 getDocumentosColeccion );


export default router;