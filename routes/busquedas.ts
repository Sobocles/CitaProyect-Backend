
import { Router } from 'express';

import { getTodo} from '../controllers/busquedas';


const router = Router();


router.get('/:busqueda',  getTodo );


export default router;