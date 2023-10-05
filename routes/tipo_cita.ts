
import { Router } from 'express';
import validarCampos from '../middlewares/validar-campos';
import { check } from 'express-validator';
import tipo_cita from '../controllers/tipo_cita';

const router = Router();

router.get('/',[

    
    validarCampos.instance.validarCampos
], tipo_cita.instance.getTipoCitas );

router.get('/:id', [

    validarCampos.instance.validarCampos
],tipo_cita.instance.getTipoCita  );


router.post(
    '/',
    [
        validarCampos.instance.validarCampos
    ], tipo_cita.instance.crearTipoCita
    
  );

router.put('/:id',
    [
    validarCampos.instance.validarCampos
    ], tipo_cita.instance.putTipoCita

 );

router.delete('/:id',[
    validarCampos.instance.validarCampos
], tipo_cita.instance.deleteTipoCita

 );

export default router;
