
import { Router } from 'express';

import { getDocumentosColeccion, getTodo} from '../controllers/busquedas';


const router = Router();


router.get('/:busqueda',  getTodo );


router.get('/coleccion/:tabla/:busqueda',  getDocumentosColeccion );


export default router;