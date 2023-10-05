import { Router } from 'express';
import CitaMedica from '../controllers/cita_medica';

import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';


const router = Router();

router.get('/',[

    
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitas );

router.get('/:id', [

    validarCampos.instance.validarCampos
], CitaMedica.instance.getCita );


router.post('/', [

    validarCampos.instance.validarCampos
], CitaMedica.instance.crearCita );

router.put('/:id',
    [
    validarCampos.instance.validarCampos
    ], CitaMedica.instance.putCita
    
 );

router.delete('/:id',[
    validarCampos.instance.validarCampos
], CitaMedica.instance.deleteCita

 );

 export default router;
