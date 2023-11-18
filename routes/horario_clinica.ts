import { Router } from 'express';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';
import HorarioClinica from '../models/horario_clinica';
import Horario_clinica from '../controllers/horario_clinica';
import ValidarJwt from '../middlewares/validar-jwt';

const router = Router();



router.get('/',[

    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
],Horario_clinica.instance.obtenerHorariosClinica );

router.get('/porEspecialidad',[

    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
],Horario_clinica.instance.obtenerEspecialidadesPorDia );

router.get('/Infoclinica',[

    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
],Horario_clinica.instance.getInfoClinica );

router.delete('/Infoclinica/:id',[

    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
],Horario_clinica.instance.deleteInfoClinica );

router.get('/:id', [
    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
],Horario_clinica.instance.getHorarioClinica );


router.post(
    '/',
    [

      
        validarCampos.instance.validarCampos
    ], Horario_clinica.instance.CrearHorarioClinica
  
  );

  router.post(
    '/Infoclinica',
    [

      
        validarCampos.instance.validarCampos
    ], Horario_clinica.instance.crearInfoClinica
  
  );

router.put('/:id',
    [
        
    validarCampos.instance.validarCampos
    ], Horario_clinica.instance.putHorarioClinica
 
 );

router.delete('/:id',[
   
    validarCampos.instance.validarCampos
], Horario_clinica.instance.deleteHorarioClinica

 );

 export default router;
