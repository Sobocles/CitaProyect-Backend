import { Router } from 'express';
import HorarioMedico from '../controllers/horario_medico';

import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';


const router = Router();

router.get('/',[

    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
],HorarioMedico.instance.getHorariosMedicos );

router.get('/:id', [
  ValidarJwt.instance.validarJwt,
  validarCampos.instance.validarCampos
], HorarioMedico.instance.getHorarioMedico );


router.post(
    '/',
    [
      ValidarJwt.instance.validarJwt,

      // Puedes agregar más validaciones según tus necesidades
    ], HorarioMedico.instance.CrearHorarioMedico
    
  );

router.put('/:id',
    [
      ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
    ], HorarioMedico.instance.putHorarioMedico);

router.delete('/:id',[
  ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], HorarioMedico.instance.deleteHorarioMedico );

 export default router;